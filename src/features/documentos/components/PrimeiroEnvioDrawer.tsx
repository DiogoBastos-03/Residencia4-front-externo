import { useRef, useState } from 'react';
import { useStore, validarArquivo, type ArquivoEscolhido } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AlertBox, Button, Drawer, Stack, Text } from '@/shared/ui';
import { consultarSituacaoEnvio, enviosChecklistStore, postarPrimeiroEnvio, renovarEnvio } from '../primeiroEnvioMock';
import type { ItemChecklist } from '../types';
import { CampoArquivo } from './CampoArquivo';

const t = strings.pages.documentos.primeiroEnvio;

type Props = {
  item: ItemChecklist;
  cenario: string | null;
  onClose: () => void;
};

export function PrimeiroEnvioDrawer({ item, cenario, onClose }: Props) {
  const id = item.documentDefinitionId;
  const idRenovacao = item.status === 'Vencido' ? item.documentSubmissionId : null;
  const envio = useStore(enviosChecklistStore).get(id);
  const [arquivo, setArquivo] = useState<(ArquivoEscolhido & { file: File }) | null>(null);
  const [operacao, setOperacao] = useState<'post' | 'get' | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const falhaPost = useRef(cenario === 'erro-post');
  const falhaGet = useRef(cenario === 'erro-get');
  const aprovado = envio?.situacao?.status === 'Approved';

  async function consultar(documentSubmissionId: string) {
    setOperacao('get');
    setErro(null);
    const falhar = falhaGet.current;
    falhaGet.current = false;
    try {
      await consultarSituacaoEnvio(documentSubmissionId, falhar);
    } catch {
      setErro(t.erroConsulta);
    } finally {
      setOperacao(null);
    }
  }

  async function confirmar() {
    if (!arquivo || validarArquivo(arquivo) || operacao || envio) return;
    setOperacao('post');
    setErro(null);
    const dados = new FormData();
    dados.set('File', arquivo.file);
    const falhar = falhaPost.current;
    falhaPost.current = false;
    try {
      let documentSubmissionId: string;
      if (idRenovacao) {
        await renovarEnvio(idRenovacao, dados, falhar);
        documentSubmissionId = idRenovacao;
      } else {
        dados.set('DocumentDefinitionId', id);
        const { body } = await postarPrimeiroEnvio(dados, falhar);
        documentSubmissionId = body.documentSubmissionId;
      }
      setArquivo(null);
      await consultar(documentSubmissionId);
    } catch {
      setErro(t.erroEnvio);
      setOperacao(null);
    }
  }

  function fechar() {
    if (!operacao) onClose();
  }

  return (
    <Drawer
      open
      onClose={fechar}
      title={envio ? t.consultar : idRenovacao ? t.renovar : t.enviar}
      subtitle={item.documentDefinitionName}
      footer={(
        <>
          <Button disabled={Boolean(operacao)} onClick={fechar}>{strings.ui.drawer.close}</Button>
          {envio ? (
            !aprovado && (
              <Button variant="primary" disabled={Boolean(operacao)} onClick={() => void consultar(envio.documentSubmissionId)}>
                {erro ? t.consultarNovamente : t.consultar}
              </Button>
            )
          ) : (
            <Button variant="primary" disabled={!arquivo || Boolean(validarArquivo(arquivo)) || Boolean(operacao)} onClick={() => void confirmar()}>
              {operacao === 'post' ? t.enviando : idRenovacao ? t.confirmarRenovacao : t.confirmar}
            </Button>
          )}
        </>
      )}
    >
      <Stack gap="lg">
        {envio ? (
          <div role="status">
            <Text weight="semibold">{t.recebido}</Text>
            <Text size="support" tone="muted">{t.protocolo(envio.documentSubmissionId)}</Text>
            {operacao === 'get' && <Text>{t.consultando}</Text>}
            {envio.situacao?.status === 'Pending' && <Text>{t.aguardando}</Text>}
            {aprovado && <Text weight="semibold">{t.aprovado}</Text>}
          </div>
        ) : (
          <fieldset disabled={operacao === 'post'}>
            <CampoArquivo
              value={arquivo}
              onChange={(metadados, file) => {
                setArquivo(metadados && file ? { ...metadados, file } : null);
                setErro(null);
              }}
            />
          </fieldset>
        )}
        {erro && <AlertBox variant="error" withIcon>{erro}</AlertBox>}
      </Stack>
    </Drawer>
  );
}

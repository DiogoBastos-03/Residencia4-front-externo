import { useState, type FormEvent } from 'react';
import { diasEntre } from '@/entities';
import { datasetStore, exemplos } from '@/mocks';
import { formatDate, maskDateBr, parseDateBr, useStore, validarArquivo, type ArquivoEscolhido } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AlertBox, Badge, Button, Field, InfoNote, Inline, Input, Modal, Select, Stack, Text, Textarea, useToast } from '@/shared/ui';
import { useAcoesEnvio } from '../hooks/useAcoesEnvio';
import type { AlvoDocumento } from '../types';
import { CampoArquivo } from './CampoArquivo';

const t = strings.pages.envio;

type Erros = Partial<Record<'arquivo' | 'validade', string>>;

type Props = {
  alvo: AlvoDocumento;
  /** O botão de enviar fica no rodapé do painel e aponta para este formulário. */
  formId: string;
  onEnviado: () => void;
  /** Revisão (/_estados): preenche com o exemplo do protótipo. */
  exemplo?: 'valido' | 'invalido' | null;
};

/** Situação atual + a frase que explica (venceu em…, exigido desde…). */
function Situacao({ alvo }: { alvo: AlvoDocumento }) {
  const detalhe =
    alvo.situacao === 'vencido' && alvo.validade
      ? t.venceuEm(formatDate(alvo.validade))
      : alvo.situacao === 'pendente' && alvo.exigidoDesde
        ? t.exigidoDesde(formatDate(alvo.exigidoDesde))
        : null;
  return (
    <Inline gap="sm">
      <Badge status={alvo.situacao} />
      {detalhe && <Text tone="muted">{detalhe}</Text>}
    </Inline>
  );
}

/**
 * Envio, renovação ou reenvio de um documento. Valida na hora o arquivo (formato e tamanho)
 * e a validade; confirma antes de mandar para a fila da JotaNunes.
 */
export function EnvioForm({ alvo, formId, onEnviado, exemplo = null }: Props) {
  const hoje = useStore(datasetStore).hoje;
  const { enviar } = useAcoesEnvio();
  const { showToast } = useToast();
  const [arquivo, setArquivo] = useState<ArquivoEscolhido | null>(
    exemplo === 'valido' ? { ...exemplos.envio.arquivo } : exemplo === 'invalido' ? { ...exemplos.envio.arquivoInvalido } : null,
  );
  const [validade, setValidade] = useState(exemplo === 'valido' ? exemplos.envio.validade : '');
  const [tipoArquivo, setTipoArquivo] = useState<string>(t.tiposArquivo[0]?.value ?? '');
  const [observacao, setObservacao] = useState(exemplo === 'valido' ? exemplos.envio.observacao : '');
  const [erros, setErros] = useState<Erros>({});
  const [confirmando, setConfirmando] = useState(false);

  function validar(): Erros {
    const iso = parseDateBr(validade);
    return {
      arquivo: arquivo ? undefined : t.erroSemArquivo,
      validade: !alvo.comData ? undefined : !iso ? t.erroValidade : diasEntre(hoje, iso) <= 0 ? t.erroValidadePassada : undefined,
    };
  }

  function submeter(event: FormEvent) {
    event.preventDefault();
    const novos = validar();
    setErros(novos);
    if (Object.values(novos).some(Boolean) || !arquivo || validarArquivo(arquivo)) return;
    setConfirmando(true);
  }

  function confirmar() {
    if (!arquivo) return;
    enviar(alvo, { arquivo, validade: parseDateBr(validade) ?? undefined, tipoArquivo, observacao: observacao.trim() });
    setConfirmando(false);
    showToast(t.toast);
    onEnviado();
  }

  const reprovado = alvo.situacao === 'reprovado' && alvo.decisao?.motivo;

  return (
    <>
      <form id={formId} noValidate onSubmit={submeter}>
        <Stack gap="lg">
          <Situacao alvo={alvo} />
          {reprovado && alvo.decisao?.motivo && (
            <AlertBox variant="error" withIcon>
              <strong className="font-semibold">{strings.dominio.motivos[alvo.decisao.motivo]}</strong> {alvo.decisao.observacao}
            </AlertBox>
          )}
          <CampoArquivo
            value={arquivo}
            onChange={(a) => {
              setArquivo(a);
              setErros((e) => ({ ...e, arquivo: undefined }));
            }}
            erro={erros.arquivo}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {alvo.comData && (
              <Field label={t.validade} error={erros.validade}>
                {(control) => (
                  <Input
                    {...control}
                    inputMode="numeric"
                    placeholder={t.validadePlaceholder}
                    value={validade}
                    onChange={(e) => {
                      setValidade(maskDateBr(e.target.value));
                      setErros((er) => ({ ...er, validade: undefined }));
                    }}
                  />
                )}
              </Field>
            )}
            <Field label={t.tipoArquivo} className={alvo.comData ? undefined : 'sm:col-span-2'}>
              {(control) => <Select {...control} options={t.tiposArquivo} value={tipoArquivo} onChange={(e) => setTipoArquivo(e.target.value)} />}
            </Field>
          </div>
          <Field
            label={
              <>
                {t.observacao} <span className="font-normal text-ink-4">{t.opcional}</span>
              </>
            }
          >
            {(control) => (
              <Textarea {...control} rows={3} placeholder={t.observacaoPlaceholder} value={observacao} onChange={(e) => setObservacao(e.target.value)} />
            )}
          </Field>
          {alvo.kind === 'documento' ? (
            <InfoNote title={strings.dominio.valeEm(alvo.obras.map((o) => o.nome))}>{t.infoEmpresa.texto}</InfoNote>
          ) : (
            <InfoNote title={t.infoFuncionario.titulo(alvo.pessoa ?? '')}>{t.infoFuncionario.texto}</InfoNote>
          )}
        </Stack>
      </form>
      <Modal
        open={confirmando}
        onClose={() => setConfirmando(false)}
        title={t.confirmar.title}
        description={t.confirmar.texto(alvo.titulo)}
        footer={
          <>
            <Button onClick={() => setConfirmando(false)}>{t.confirmar.voltar}</Button>
            <Button variant="primary" onClick={confirmar}>
              {t.confirmar.confirmar}
            </Button>
          </>
        }
      />
    </>
  );
}


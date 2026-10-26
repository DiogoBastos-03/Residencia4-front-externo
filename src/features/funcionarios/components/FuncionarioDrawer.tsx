import { useId, useRef } from 'react';
import { ArrowUpTrayIcon, UserIcon } from '@heroicons/react/24/outline';
import { acaoPara, type ItemDaPessoa } from '@/entities';
import { alvoArquivo, EnvioForm } from '@/features/documentos';
import { datasetStore } from '@/mocks';
import { formatCpf, formatDate, formatPhone, paths, useStore } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AlertBox, Badge, Button, ButtonLink, Drawer, EmptyState, Heading, KeyValueList, Mono, Stack, Tag, Text } from '@/shared/ui';
import { useFuncionario, type FichaFuncionario } from '../hooks/useFuncionario';

const t = strings.pages.funcionarios.painel;

/** Um documento da pessoa. O motivo da reprovação aparece aqui, junto do botão de reenviar. */
function LinhaDocumento({ ficha, item, onEnviar }: { ficha: FichaFuncionario; item: ItemDaPessoa; onEnviar: (tipo: string) => void }) {
  const acao = acaoPara(item.situacao);
  const curto = item.nome.split(' — ')[0] ?? item.nome;
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-3 last:border-b-0">
      <div className="min-w-0 flex-1 basis-48">
        <p className="flex min-w-0 items-center gap-2">
          <span className="truncate text-body">{item.nome}</span>
          <Tag kind={item.item.obrigatoriedade} className="flex-none" />
        </p>
        <Text size="label" tone="muted" className="mt-0.5 truncate">
          {item.arquivo
            ? t.meta(item.arquivo.arquivo.nome, strings.dominio.tamanho(item.arquivo.arquivo.tamanhoKb))
            : t.naoEnviado}
          {item.arquivo?.validade && item.situacao !== 'reprovado' ? `${strings.dominio.separador}${t.validadeAte(formatDate(item.arquivo.validade))}` : ''}
        </Text>
      </div>
      <Badge status={item.situacao} />
      {acao === 'ver' ? (
        item.arquivo && (
          <ButtonLink to={paths.documento(item.arquivo.id)} variant="tertiary" size="sm" aria-label={t.abrirDescricao(item.nome)}>
            {t.abrir}
          </ButtonLink>
        )
      ) : (
        <Button
          size="sm"
          icon={ArrowUpTrayIcon}
          aria-label={t.acaoDescricao(strings.dominio.acoes[acao], `${curto} — ${ficha.funcionario.nome}`)}
          onClick={() => onEnviar(item.item.tipoDocumentoId)}
        >
          {strings.dominio.acoes[acao]}
        </Button>
      )}
      {item.situacao === 'reprovado' && item.arquivo?.decisao?.motivo && (
        <Text size="label" className="basis-full text-danger">
          {t.motivo(strings.dominio.motivos[item.arquivo.decisao.motivo], item.arquivo.decisao.observacao ?? '')}
        </Text>
      )}
    </li>
  );
}

function Detalhe({ ficha, onEnviar }: { ficha: FichaFuncionario; onEnviar: (tipo: string) => void }) {
  const reprovados = ficha.itens.filter((i) => i.situacao === 'reprovado').length;
  const faltando = ficha.itens.filter((i) => i.item.obrigatoriedade === 'obrigatorio' && i.situacao === 'pendente').length;
  const f = ficha.funcionario;
  return (
    <Stack gap="lg">
      {reprovados > 0 && (
        <AlertBox variant="error" withIcon>
          <strong className="font-semibold">{t.alerta(reprovados)}</strong> {t.alertaTexto}
        </AlertBox>
      )}
      {reprovados === 0 && faltando > 0 && (
        <AlertBox variant="warning" withIcon>
          <strong className="font-semibold">{t.pendenteTitulo(faltando)}</strong> {t.pendenteTexto}
        </AlertBox>
      )}
      <KeyValueList
        className="grid-cols-[130px_minmax(0,1fr)]"
        items={[
          { key: 'cpf', label: t.cpf, value: <Mono>{formatCpf(f.cpf)}</Mono> },
          { key: 'tel', label: t.telefone, value: <Mono>{formatPhone(f.telefone)}</Mono> },
          { key: 'obra', label: t.obra, value: ficha.obra?.nome ?? strings.common.emptyValue },
          { key: 'desde', label: t.alocadoDesde, value: <Mono>{formatDate(f.alocadoDesde)}</Mono> },
          ...(ficha.remessa ? [{ key: 'remessa', label: t.enviadoEm, value: t.remessa(ficha.remessa.funcionarioIds.length) }] : []),
        ]}
      />
      <section className="border-t border-border pt-4">
        <Heading level={3}>{t.documentos}</Heading>
        <ul className="mt-3 rounded-control border border-border">
          {ficha.itens.map((item) => (
            <LinhaDocumento key={item.item.tipoDocumentoId} ficha={ficha} item={item} onEnviar={onEnviar} />
          ))}
        </ul>
      </section>
    </Stack>
  );
}

type Props = {
  id: string | undefined;
  /** Tipo de documento a reenviar (?reenviar=): o painel mostra o envio. */
  reenviar: string | null;
  onClose: () => void;
  onReenviar: (tipo: string | null) => void;
};

/** Painel lateral da pessoa, sobre a lista. O reenvio acontece no mesmo painel. */
export function FuncionarioDrawer({ id, reenviar, onClose, onReenviar }: Props) {
  const ds = useStore(datasetStore);
  const query = useFuncionario(id);
  const formId = useId();
  const ultimo = useRef<FichaFuncionario | null>(null);
  if (query.data) ultimo.current = query.data;
  const ficha = id ? (query.data ?? null) : ultimo.current;
  const alvo = ficha && reenviar ? alvoArquivo(ds, ficha.funcionario.id, reenviar) : null;

  // Botão principal do rodapé: o primeiro documento a reenviar (ou a enviar).
  const pendente = ficha?.itens.find((i) => i.situacao === 'reprovado') ?? ficha?.itens.find((i) => i.item.obrigatoriedade === 'obrigatorio' && i.situacao === 'pendente');
  const curto = pendente ? (pendente.nome.split(' — ')[0] ?? pendente.nome) : '';

  const titulo = alvo ? strings.pages.envio.titulo[acaoPara(alvo.situacao) === 'enviar' ? 'enviar' : 'reenviar'] : (ficha?.funcionario.nome ?? t.naoEncontradoTitle);
  const subtitulo = alvo ? alvo.titulo : ficha ? t.subtitulo(ficha.funcionario.funcao, ficha.obra?.nome ?? '') : undefined;

  const rodape = !ficha ? undefined : alvo ? (
    <>
      <Button variant="tertiary" onClick={() => onReenviar(null)}>
        {t.voltar}
      </Button>
      <Button variant="primary" type="submit" form={formId}>
        {strings.pages.envio.enviar}
      </Button>
    </>
  ) : (
    <>
      <Button variant="tertiary" onClick={onClose}>
        {t.cancelar}
      </Button>
      {pendente && (
        <Button variant="primary" icon={ArrowUpTrayIcon} onClick={() => onReenviar(pendente.item.tipoDocumentoId)}>
          {pendente.situacao === 'reprovado' ? t.reenviarDoc(curto) : `${t.enviar} ${curto}`}
        </Button>
      )}
    </>
  );

  return (
    <Drawer open={Boolean(id)} onClose={onClose} title={titulo} subtitle={subtitulo} footer={rodape}>
      {!ficha ? (
        <EmptyState framed={false} icon={UserIcon} title={t.naoEncontradoTitle} description={t.naoEncontradoDescription} />
      ) : alvo ? (
        <EnvioForm key={alvo.id} alvo={alvo} formId={formId} onEnviado={() => onReenviar(null)} />
      ) : (
        <Detalhe ficha={ficha} onEnviar={onReenviar} />
      )}
    </Drawer>
  );
}

import { useId, useRef } from 'react';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { acaoPara, diasEntre } from '@/entities';
import { datasetStore } from '@/mocks';
import { formatDate, useStore } from '@/shared/lib';
import { strings } from '@/shared/strings';
import {
  AlertBox,
  Badge,
  Button,
  Drawer,
  EmptyState,
  Heading,
  Icon,
  InfoNote,
  Inline,
  KeyValueList,
  Mono,
  Stack,
  Tag,
  useToast,
} from '@/shared/ui';
import { useDocumento } from '../hooks/useDocumento';
import type { AlvoDocumento } from '../types';
import { EnvioForm } from './EnvioForm';

const t = strings.pages.documentos.painel;
const te = strings.pages.envio;

/** Enviar (pendente), renovar (vencido ou vencendo) ou reenviar (reprovado). */
function modoEnvio(alvo: AlvoDocumento): 'enviar' | 'renovar' | 'reenviar' | null {
  if (alvo.situacao === 'venceEmBreve') return 'renovar';
  const acao = acaoPara(alvo.situacao);
  return acao === 'ver' ? null : acao;
}

function ArquivoEnviadoBox({ alvo }: { alvo: AlvoDocumento }) {
  const { showToast } = useToast();
  if (!alvo.arquivo) return null;
  return (
    <section className="border-t border-border pt-4">
      <Heading level={3}>{t.arquivoEnviado}</Heading>
      <div className="mt-3 flex items-center gap-3 rounded-control border border-border px-4 py-3">
        <span className="flex size-8 flex-none items-center justify-center rounded-control bg-surface-3 text-ink-3">
          <Icon icon={DocumentTextIcon} size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body">{alvo.arquivo.nome}</p>
          <p className="text-label text-ink-3">
            {t.arquivoMeta(strings.dominio.tamanho(alvo.arquivo.tamanhoKb), formatDate(alvo.arquivo.enviadoEm))}
          </p>
        </div>
        <Button
          variant="tertiary"
          size="sm"
          icon={ArrowDownTrayIcon}
          aria-label={t.baixarDescricao(alvo.arquivo.nome)}
          onClick={() => showToast(t.baixarToast)}
        >
          {t.baixar}
        </Button>
      </div>
    </section>
  );
}

function Anteriores({ alvo }: { alvo: AlvoDocumento }) {
  if (alvo.anteriores.length === 0) return null;
  return (
    <section className="border-t border-border pt-4">
      <Heading level={3}>{t.anteriores}</Heading>
      <ul className="mt-3 rounded-control border border-border">
        {alvo.anteriores.map((a) => (
          <li key={`${a.enviadoEm}-${a.arquivo}`} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
            <Mono className="flex-none text-label text-ink-4">{formatDate(a.enviadoEm)}</Mono>
            <span className="min-w-0 flex-1 truncate text-body">{a.arquivo}</span>
            <Badge status={a.resultado} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** O que o documento é hoje: situação, motivo da reprovação, datas, arquivo e envios anteriores. */
function Detalhe({ alvo }: { alvo: AlvoDocumento }) {
  const hoje = useStore(datasetStore).hoje;
  const exigidoEm = alvo.obras.length === 1 ? (alvo.obras[0]?.nome ?? '') : t.suasObras(alvo.obras.length);
  const vazio = strings.common.emptyValue;
  return (
    <Stack gap="lg">
      <Inline gap="sm">
        <Badge status={alvo.situacao} />
        <Tag kind={alvo.obrigatoriedade} />
      </Inline>
      {alvo.situacao === 'reprovado' && alvo.decisao?.motivo && (
        <AlertBox variant="error" withIcon>
          <strong className="font-semibold">{strings.dominio.motivos[alvo.decisao.motivo]}</strong> {alvo.decisao.observacao}
        </AlertBox>
      )}
      {alvo.situacao === 'vencido' && alvo.validade && <AlertBox variant="error" withIcon>{t.vencido(formatDate(alvo.validade))}</AlertBox>}
      {alvo.situacao === 'venceEmBreve' && alvo.validade && (
        <AlertBox variant="warning" withIcon>
          {t.venceEmBreve(diasEntre(hoje, alvo.validade))}
        </AlertBox>
      )}
      {alvo.situacao === 'pendente' && (
        <InfoNote title={t.naoEnviadoTitle}>{t.naoEnviado(alvo.exigidoDesde ? formatDate(alvo.exigidoDesde) : formatDate(hoje))}</InfoNote>
      )}
      {alvo.situacao === 'emAnalise' && <InfoNote>{t.emAnalise}</InfoNote>}
      <KeyValueList
        className="grid-cols-[130px_minmax(0,1fr)]"
        items={[
          { key: 'exigido', label: t.exigidoEm, value: exigidoEm },
          { key: 'validade', label: t.validade, value: alvo.validade ? <Mono>{formatDate(alvo.validade)}</Mono> : vazio },
          { key: 'enviado', label: t.enviadoEm, value: alvo.arquivo ? <Mono>{formatDate(alvo.arquivo.enviadoEm)}</Mono> : vazio },
          ...(alvo.decisao
            ? [
                { key: 'por', label: t.analisadoPor, value: strings.dominio.daJotaNunes(alvo.decisao.por) },
                { key: 'em', label: t.decididoEm, value: <Mono>{formatDate(alvo.decisao.em)}</Mono> },
              ]
            : []),
        ]}
      />
      <ArquivoEnviadoBox alvo={alvo} />
      <Anteriores alvo={alvo} />
    </Stack>
  );
}

type Props = {
  /** Id da rota; sem id, o painel está fechado. */
  id: string | undefined;
  /** O painel abre direto no envio (?acao=enviar). */
  enviar: boolean;
  exemplo?: 'valido' | 'invalido' | null;
  onClose: () => void;
  /** Troca entre detalhe e envio, mantendo o painel aberto. */
  onModo: (enviar: boolean) => void;
};

/** Painel lateral do documento, sobre a lista. Mostra o detalhe ou o formulário de envio. */
export function DocumentoDrawer({ id, enviar, exemplo, onClose, onModo }: Props) {
  const query = useDocumento(id);
  const { showToast } = useToast();
  const formId = useId();
  // Enquanto o painel fecha (animação de saída), continua mostrando o último documento.
  const ultimo = useRef<AlvoDocumento | null>(null);
  if (query.data) ultimo.current = query.data;
  const alvo = id ? (query.data ?? null) : ultimo.current;
  const modo = alvo ? modoEnvio(alvo) : null;
  const enviando = Boolean(alvo && enviar && modo);

  const titulo = alvo ? (enviando && modo ? te.titulo[modo] : alvo.titulo) : t.naoEncontradoTitle;
  const subtitulo = alvo ? (enviando ? alvo.titulo : alvo.subtitulo) : undefined;

  const rodape = !alvo ? undefined : enviando ? (
    <>
      <Button variant="tertiary" onClick={onClose}>
        {t.cancelar}
      </Button>
      <Button variant="primary" type="submit" form={formId}>
        {te.enviar}
      </Button>
    </>
  ) : (
    <>
      <Button variant="tertiary" onClick={onClose}>
        {t.cancelar}
      </Button>
      {modo ? (
        <Button variant="primary" icon={ArrowUpTrayIcon} onClick={() => onModo(true)}>
          {t[modo]}
        </Button>
      ) : (
        alvo.arquivo && (
          <Button variant="primary" icon={ArrowDownTrayIcon} onClick={() => showToast(t.baixarToast)}>
            {t.baixarArquivo}
          </Button>
        )
      )}
    </>
  );

  return (
    <Drawer open={Boolean(id)} onClose={onClose} title={titulo} subtitle={subtitulo} footer={rodape}>
      {!alvo ? (
        <EmptyState framed={false} icon={DocumentTextIcon} title={t.naoEncontradoTitle} description={t.naoEncontradoDescription} />
      ) : enviando ? (
        <EnvioForm key={`${alvo.id}-envio`} alvo={alvo} formId={formId} onEnviado={onClose} exemplo={exemplo} />
      ) : (
        <Detalhe alvo={alvo} />
      )}
    </Drawer>
  );
}

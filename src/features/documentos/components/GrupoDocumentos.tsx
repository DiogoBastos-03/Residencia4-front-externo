import { DocumentTextIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { acaoPara, type LinhaDocumento } from '@/entities';
import { formatDate, paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { Badge, ButtonLink, Icon, Mono, Table, Tag, Text, type TableColumn } from '@/shared/ui';
import type { GrupoDocumentos as Grupo, ListaDocumentos } from '../types';

const t = strings.pages.documentos;
const vazio = strings.common.emptyValue;

const COLUNAS: readonly TableColumn<LinhaDocumento>[] = [
  {
    key: 'documento',
    header: t.colunas.documento,
    mobile: 'title',
    tone: 'strong',
    cell: (l) => (
      <span className="flex items-center gap-2.5 font-normal">
        <Icon icon={DocumentTextIcon} size={16} className="flex-none text-ink-4" />
        <span>{l.nome}</span>
      </span>
    ),
  },
  { key: 'tipo', header: t.colunas.tipo, width: 'w-30', cell: (l) => <Tag kind={l.item.obrigatoriedade} /> },
  { key: 'situacao', header: t.colunas.situacao, width: 'w-37.5', mobile: 'badge', cell: (l) => <Badge status={l.situacao} /> },
  {
    key: 'validade',
    header: t.colunas.validade,
    width: 'w-32.5',
    nowrap: true,
    cell: (l) => (l.doc?.validade && l.situacao !== 'emAnalise' ? <Mono>{formatDate(l.doc.validade)}</Mono> : vazio),
  },
  {
    key: 'envio',
    header: t.colunas.ultimoEnvio,
    width: 'w-32.5',
    nowrap: true,
    cell: (l) => (l.doc?.arquivo ? <Mono>{formatDate(l.doc.arquivo.enviadoEm)}</Mono> : vazio),
  },
];

/** Faixa do item de funcionários: um item com vários arquivos, resumido aqui. */
function FaixaFuncionarios({ contagem }: { contagem: ListaDocumentos['funcionarios'] }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 rounded-control border border-border bg-surface-2 px-4 py-3">
      <Icon icon={UserGroupIcon} size={18} className="flex-none text-ink-3" />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-body">
          {t.funcionarios.titulo}
          <Tag kind="funcionarios" />
        </p>
        <Text size="label" tone="muted" className="mt-0.5">
          {contagem.total === 0 ? t.funcionarios.nenhum : t.funcionarios.resumo(contagem)}
        </Text>
      </div>
      <div className="flex flex-wrap gap-2">
        <ButtonLink to={paths.funcionarios} size="sm">
          {t.funcionarios.ver}
        </ButtonLink>
        <ButtonLink to={paths.novaRemessa()} size="sm" variant="primary" icon={PlusIcon}>
          {t.funcionarios.adicionar}
        </ButtonLink>
      </div>
    </div>
  );
}

type Props = {
  grupo: Grupo;
  linhas: readonly LinhaDocumento[];
  funcionarios: ListaDocumentos['funcionarios'] | null;
};

/** Uma lista de exigências: nome, tipo, onde é exigida, quanto está em dia e os documentos. */
export function GrupoDocumentos({ grupo, linhas, funcionarios }: Props) {
  const titleId = `lista-${grupo.lista.id}`;
  return (
    <section aria-labelledby={titleId} id={grupo.lista.id} className="scroll-mt-4">
      <div className="mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <h2 id={titleId} className="text-block font-semibold">
          {grupo.lista.nome}
        </h2>
        <Badge status={grupo.lista.tipo} />
        <Text size="support" tone="muted" as="span">
          {strings.dominio.exigidoEm(grupo.obras.map((o) => o.nome))}
          {strings.dominio.separador}
          {strings.dominio.emDia(grupo.emDia, grupo.obrigatorios)}
        </Text>
      </div>
      <Table
        caption={t.caption(grupo.lista.nome)}
        columns={COLUNAS}
        rows={linhas}
        rowKey={(l) => l.tipoDocumentoId}
        rowTo={(l) => paths.documento(l.tipoDocumentoId)}
        action={{
          label: (l) => strings.dominio.acoes[acaoPara(l.situacao)],
          describe: (l) => l.nome,
          to: (l) => paths.documento(l.tipoDocumentoId, acaoPara(l.situacao) !== 'ver'),
          emphasis: (l) => acaoPara(l.situacao) !== 'ver',
        }}
      />
      {funcionarios && <FaixaFuncionarios contagem={funcionarios} />}
    </section>
  );
}

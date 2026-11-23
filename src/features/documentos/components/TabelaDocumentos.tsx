import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/shared/lib';
import { strings, type StatusKey } from '@/shared/strings';
import { Badge, Icon, Mono, Table, Tag, type TableColumn } from '@/shared/ui';
import type { ItemChecklist, StatusChecklist } from '../types';

const t = strings.pages.documentos;

const badgePorStatus: Record<StatusChecklist, StatusKey> = {
  Pendente: 'pendente',
  'Em análise': 'emAnalise',
  Atendido: 'aprovado',
  Vencido: 'vencido',
};

const colunas: readonly TableColumn<ItemChecklist>[] = [
  {
    key: 'documento',
    header: t.colunas.documento,
    mobile: 'title',
    tone: 'strong',
    cell: (item) => (
      <span className="flex items-center gap-2.5 font-normal">
        <Icon icon={DocumentTextIcon} size={16} className="flex-none text-ink-4" />
        <span>{item.documentDefinitionName}</span>
      </span>
    ),
  },
  {
    key: 'obrigatoriedade',
    header: t.colunas.obrigatoriedade,
    width: 'w-36',
    cell: (item) => <Tag kind={item.required ? 'obrigatorio' : 'opcional'} />,
  },
  {
    key: 'situacao',
    header: t.colunas.situacao,
    width: 'w-37.5',
    mobile: 'badge',
    cell: (item) => <Badge status={badgePorStatus[item.status]}>{item.status}</Badge>,
  },
  {
    key: 'validade',
    header: t.colunas.validade,
    width: 'w-32.5',
    nowrap: true,
    cell: (item) => item.expiresAt
      ? <Mono>{formatDate(item.expiresAt.slice(0, 10))}</Mono>
      : strings.common.emptyValue,
  },
];

export function TabelaDocumentos({ itens }: { itens: readonly ItemChecklist[] }) {
  return <Table caption={t.title} columns={colunas} rows={itens} rowKey={(item) => item.documentDefinitionId} />;
}

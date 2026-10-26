import { ArrowUpTrayIcon, CheckCircleIcon, ExclamationTriangleIcon, LinkIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { AcaoEvento, EventoHistorico } from '@/entities';
import { formatDate } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { Icon, Mono, Table, type HeroIcon, type TableColumn } from '@/shared/ui';

const t = strings.pages.historico;

const ICONE: Record<AcaoEvento, { icon: HeroIcon; cor: string }> = {
  documentoEnviado: { icon: ArrowUpTrayIcon, cor: 'text-ink-3' },
  remessaEnviada: { icon: ArrowUpTrayIcon, cor: 'text-ink-3' },
  documentoAprovado: { icon: CheckCircleIcon, cor: 'text-ok' },
  documentoReprovado: { icon: XCircleIcon, cor: 'text-danger' },
  novaExigencia: { icon: ExclamationTriangleIcon, cor: 'text-ink-3' },
  obraVinculada: { icon: LinkIcon, cor: 'text-ink-3' },
};

const COLUNAS: readonly TableColumn<EventoHistorico>[] = [
  { key: 'data', header: t.colunas.data, width: 'w-30', nowrap: true, cell: (e) => <Mono>{formatDate(e.quando)}</Mono> },
  { key: 'hora', header: t.colunas.hora, width: 'w-20', nowrap: true, cell: (e) => <Mono>{formatDate(e.quando, 'time')}</Mono> },
  {
    key: 'evento',
    header: t.colunas.evento,
    width: 'w-55',
    mobile: 'title',
    tone: 'soft',
    cell: (e) => (
      <span className="flex items-center gap-2">
        <Icon icon={ICONE[e.acao].icon} size={16} className={`flex-none ${ICONE[e.acao].cor}`} />
        {t.acoes[e.acao]}
      </span>
    ),
  },
  { key: 'item', header: t.colunas.item, tone: 'soft', cell: (e) => e.item },
  {
    key: 'por',
    header: t.colunas.por,
    cell: (e) => (e.por.kind === 'voce' ? strings.common.voce : strings.dominio.daJotaNunes(e.por.nome)),
  },
];

export function HistoricoTabela({ eventos }: { eventos: readonly EventoHistorico[] }) {
  return <Table caption={t.caption} columns={COLUNAS} rows={eventos} rowKey={(e) => e.id} />;
}

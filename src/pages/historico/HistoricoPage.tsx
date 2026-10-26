import { useMemo, useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { CATEGORIA, diasEntre, type CategoriaEvento } from '@/entities';
import { HistoricoTabela, useHistorico } from '@/features/historico';
import { useDocumentTitle } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AsyncContent, EmptyState, FilterBar, PageHeader, Select, Skeleton, SkeletonTable, Stack } from '@/shared/ui';

const t = strings.pages.historico;
type Filtro = 'tudo' | CategoriaEvento;

export function HistoricoPage() {
  useDocumentTitle(t.title);
  const query = useHistorico();
  const [filtro, setFiltro] = useState<Filtro>('tudo');
  const [periodo, setPeriodo] = useState('365');

  const noPeriodo = useMemo(() => {
    const d = query.data;
    if (!d) return [];
    return d.eventos.filter((e) => diasEntre(e.quando.slice(0, 10), d.hoje) <= Number(periodo));
  }, [query.data, periodo]);

  const conta = (c: CategoriaEvento) => noPeriodo.filter((e) => CATEGORIA[e.acao] === c).length;
  const opcoes: Array<{ value: Filtro; label: string; count: number }> = [
    { value: 'tudo', label: t.filtros.tudo, count: noPeriodo.length },
    { value: 'envio', label: t.filtros.envio, count: conta('envio') },
    { value: 'decisao', label: t.filtros.decisao, count: conta('decisao') },
    { value: 'exigencia', label: t.filtros.exigencia, count: conta('exigencia') },
  ];
  const linhas = filtro === 'tudo' ? noPeriodo : noPeriodo.filter((e) => CATEGORIA[e.acao] === filtro);

  return (
    <Stack>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <AsyncContent
        query={query}
        skeleton={
          <Stack>
            <Skeleton className="h-8.5 w-96 max-w-full" />
            <SkeletonTable rows={10} columns={5} />
          </Stack>
        }
        isEmpty={(d) => d.eventos.length === 0}
        empty={<EmptyState icon={ClockIcon} title={t.vazioTitle} description={t.vazioDescription} />}
      >
        {() => (
          <Stack gap="lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <FilterBar label={t.filtrosLabel} options={opcoes} value={filtro} onChange={setFiltro} />
              <Select aria-label={t.periodoLabel} options={t.periodos} value={periodo} onChange={(e) => setPeriodo(e.target.value)} wrapperClassName="w-60 max-md:w-full" />
            </div>
            {linhas.length === 0 ? (
              <EmptyState icon={ClockIcon} title={t.vazioTitle} description={t.vazioDescription} />
            ) : (
              <HistoricoTabela eventos={linhas} />
            )}
          </Stack>
        )}
      </AsyncContent>
    </Stack>
  );
}

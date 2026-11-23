import { useSearchParams } from 'react-router';
import { metricasDocumentos, precisaAtencao, resumoObra, type Dataset } from '@/entities';
import { useDatasetQuery } from '@/mocks';
import { PARAM_ESTADO } from '@/shared/lib';
import { pendingSummaryMock, pendingSummaryVazio, type PendingSummary } from '../pendingSummaryMock';

function carregarInicio(ds: Dataset, resumo: PendingSummary) {
  return {
    hoje: ds.hoje,
    metricas: metricasDocumentos(ds),
    atencao: precisaAtencao(ds),
    obras: ds.obras.map((o) => resumoObra(ds, o)),
    resumo,
    eventos: ds.eventos.slice(0, 4),
  };
}

export type Inicio = ReturnType<typeof carregarInicio>;

export function useInicio() {
  const [params] = useSearchParams();
  const resumo = params.get(PARAM_ESTADO) === 'vazio' ? pendingSummaryVazio : pendingSummaryMock;
  return useDatasetQuery('inicio', (ds) => carregarInicio(ds, resumo));
}

import { metricasDocumentos, precisaAtencao, proximosVencimentos, resumoObra, type Dataset } from '@/entities';
import { useDatasetQuery } from '@/mocks';

export function carregarInicio(ds: Dataset) {
  return {
    hoje: ds.hoje,
    metricas: metricasDocumentos(ds),
    atencao: precisaAtencao(ds),
    obras: ds.obras.map((o) => resumoObra(ds, o)),
    vencimentos: proximosVencimentos(ds, 4),
    eventos: ds.eventos.slice(0, 4),
  };
}

export type Inicio = ReturnType<typeof carregarInicio>;

export function useInicio() {
  return useDatasetQuery('inicio', carregarInicio);
}

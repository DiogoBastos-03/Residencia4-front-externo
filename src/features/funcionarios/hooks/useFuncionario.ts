import { useMemo } from 'react';
import { resumoFuncionario, type Dataset, type Remessa, type ResumoFuncionario } from '@/entities';
import { datasetStore } from '@/mocks';
import { useStore, type QueryResult } from '@/shared/lib';

export type FichaFuncionario = ResumoFuncionario & { remessa: Remessa | undefined };

export function carregarFuncionario(ds: Dataset, id: string): FichaFuncionario | null {
  const funcionario = ds.funcionarios.find((f) => f.id === id);
  if (!funcionario) return null;
  return { ...resumoFuncionario(ds, funcionario), remessa: ds.remessas.find((r) => r.id === funcionario.remessaId) };
}

const NADA = () => undefined;

/** Pessoa do painel lateral: lida na hora, com o contrato { data, isLoading, error, refetch }. */
export function useFuncionario(id: string | undefined): QueryResult<FichaFuncionario | null> {
  const ds = useStore(datasetStore);
  const data = useMemo(() => (id ? carregarFuncionario(ds, id) : null), [ds, id]);
  return { data, isLoading: false, error: null, refetch: NADA };
}

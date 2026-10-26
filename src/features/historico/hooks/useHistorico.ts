import { useDatasetQuery } from '@/mocks';

export function useHistorico() {
  return useDatasetQuery('historico', (ds) => ({ hoje: ds.hoje, eventos: [...ds.eventos] }), {
    empty: { hoje: '', eventos: [] },
  });
}

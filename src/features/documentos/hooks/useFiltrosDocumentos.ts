import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { FiltroDocumentos, ItemChecklist, StatusChecklist } from '../types';

const FILTROS: readonly FiltroDocumentos[] = ['todos', 'pendentes', 'analise', 'aprovados'];

export const filtroDoStatus: Record<StatusChecklist, Exclude<FiltroDocumentos, 'todos'>> = {
  Pendente: 'pendentes',
  Vencido: 'pendentes',
  'Em análise': 'analise',
  Atendido: 'aprovados',
};

function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function filtrarLinhas(linhas: readonly ItemChecklist[], filtro: FiltroDocumentos, busca: string): ItemChecklist[] {
  const termo = normalizar(busca.trim());
  return linhas.filter((item) => {
    if (filtro !== 'todos' && filtroDoStatus[item.status] !== filtro) return false;
    return !termo || normalizar(item.documentDefinitionName).includes(termo);
  });
}

/** Filtro e busca na URL (?filtro=&busca=), para o painel abrir e fechar sem perder a lista. */
export function useFiltrosDocumentos() {
  const [params, setParams] = useSearchParams();
  const filtro = FILTROS.find((f) => f === params.get('filtro')) ?? 'todos';
  const busca = params.get('busca') ?? '';
  const atualizar = useCallback(
    (parcial: { filtro?: FiltroDocumentos; busca?: string }) =>
      setParams(
        (atual) => {
          const p = new URLSearchParams(atual);
          if (parcial.filtro !== undefined) {
            if (parcial.filtro === 'todos') p.delete('filtro');
            else p.set('filtro', parcial.filtro);
          }
          if (parcial.busca !== undefined) {
            if (parcial.busca) p.set('busca', parcial.busca);
            else p.delete('busca');
          }
          return p;
        },
        { replace: true },
      ),
    [setParams],
  );
  return useMemo(() => ({ filtro, busca, atualizar }), [filtro, busca, atualizar]);
}

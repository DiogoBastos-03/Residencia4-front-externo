import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { LinhaDocumento } from '@/entities';
import type { FiltroDocumentos } from '../types';

const FILTROS: readonly FiltroDocumentos[] = ['todos', 'pendentes', 'analise', 'aprovados'];

function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function filtrarLinhas(linhas: readonly LinhaDocumento[], filtro: FiltroDocumentos, busca: string): LinhaDocumento[] {
  const termo = normalizar(busca.trim());
  return linhas.filter((l) => {
    if (filtro === 'pendentes' && !(l.situacao === 'pendente' || l.situacao === 'vencido' || l.situacao === 'reprovado')) return false;
    if (filtro === 'analise' && l.situacao !== 'emAnalise') return false;
    if (filtro === 'aprovados' && l.situacao !== 'aprovado') return false;
    return !termo || normalizar(l.nome).includes(termo);
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

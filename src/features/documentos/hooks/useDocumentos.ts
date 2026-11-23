import { useMockQuery } from '@/shared/lib';
import { checklistMock } from '../checklistMock';
import type { ItemChecklist, ListaDocumentos } from '../types';
import { filtroDoStatus } from './useFiltrosDocumentos';

function carregarDocumentos(itens: readonly ItemChecklist[]): ListaDocumentos {
  const contagem = { todos: itens.length, pendentes: 0, analise: 0, aprovados: 0 };
  for (const item of itens) contagem[filtroDoStatus[item.status]] += 1;
  return { itens, contagem };
}

const VAZIO = carregarDocumentos([]);

export function useDocumentos() {
  return useMockQuery('documentos', () => carregarDocumentos(checklistMock), { empty: VAZIO });
}

/** Documentos da empresa com pendência — o contador do item "Documentos" no menu. */
export function useContadorPendencias() {
  return useMockQuery('contador-pendencias', () => carregarDocumentos(checklistMock).contagem.pendentes, { simulate: false });
}

import { useMemo } from 'react';
import { useMockQuery, useStore } from '@/shared/lib';
import { checklistMock } from '../checklistMock';
import { enviosChecklistStore } from '../primeiroEnvioMock';
import type { ItemChecklist, ListaDocumentos } from '../types';
import { filtroDoStatus } from './useFiltrosDocumentos';

function carregarDocumentos(itens: readonly ItemChecklist[]): ListaDocumentos {
  const contagem = { todos: itens.length, pendentes: 0, analise: 0, aprovados: 0 };
  for (const item of itens) contagem[filtroDoStatus[item.status]] += 1;
  return { itens, contagem };
}

const VAZIO = carregarDocumentos([]);

function useChecklist() {
  const envios = useStore(enviosChecklistStore);
  return useMemo(() => checklistMock.map((item): ItemChecklist => {
    const envio = envios.get(item.documentDefinitionId);
    if (!envio) return item;
    return {
      ...item,
      documentSubmissionId: envio.documentSubmissionId,
      status: envio.situacao?.status === 'Approved' ? 'Atendido' : 'Em análise',
      expiresAt: null,
    };
  }), [envios]);
}

export function useDocumentos() {
  const itens = useChecklist();
  return useMockQuery('documentos', () => carregarDocumentos(itens), { empty: VAZIO, version: itens });
}

/** Documentos da empresa com pendência — o contador do item "Documentos" no menu. */
export function useContadorPendencias() {
  const itens = useChecklist();
  return useMockQuery('contador-pendencias', () => carregarDocumentos(itens).contagem.pendentes, { simulate: false, version: itens });
}

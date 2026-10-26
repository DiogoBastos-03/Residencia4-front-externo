import { useCallback } from 'react';
import type { Empresa } from '@/entities';
import { datasetStore, useDatasetQuery } from '@/mocks';

export function useEmpresa() {
  return useDatasetQuery('empresa', (ds) => ds.empresa);
}

export type ContatoEmpresa = Pick<Empresa, 'emailNotificacoes' | 'responsavel' | 'telefone'>;

/** Contato e acesso: a única parte do cadastro que a empresa edita. Altera os dados em memória. */
export function useAcoesEmpresa() {
  const salvarContato = useCallback((contato: ContatoEmpresa): boolean => {
    const atual = datasetStore.get().empresa;
    const mudou =
      contato.emailNotificacoes.trim() !== atual.emailNotificacoes ||
      contato.responsavel.trim() !== atual.responsavel ||
      contato.telefone !== atual.telefone;
    if (!mudou) return false;
    datasetStore.set((ds) => ({
      ...ds,
      empresa: { ...ds.empresa, emailNotificacoes: contato.emailNotificacoes.trim(), responsavel: contato.responsavel.trim(), telefone: contato.telefone },
    }));
    return true;
  }, []);
  return { salvarContato };
}

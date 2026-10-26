import type { IsoDate } from './common';

export type SituacaoObra = 'emExecucao' | 'planejamento';

/** Obra da JotaNunes em que a empresa está contratada. A obra liga as listas de exigências à empresa. */
export type Obra = {
  id: string;
  codigo: string;
  nome: string;
  cidade: string;
  uf: string;
  situacao: SituacaoObra;
  /** O que a empresa faz nesta obra. */
  servicoContratado: string;
  inicio: IsoDate;
  fim: IsoDate;
  /** Listas de exigências vinculadas à obra (todas, de qualquer tipo). */
  listaIds: readonly string[];
};

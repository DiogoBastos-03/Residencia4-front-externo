import type { EscopoItem, Obrigatoriedade, TipoFornecimento } from './common';

export type TipoDocumento = {
  id: string;
  nome: string;
  /** Nome curto, para títulos como "ASO — Wellington Duarte". */
  curto?: string;
};

export type ItemExigido = {
  tipoDocumentoId: string;
  escopo: EscopoItem;
  obrigatoriedade: Obrigatoriedade;
  /** Com data: o documento vence e é preciso informar a validade ao enviar. */
  validade: 'comData' | 'semValidade';
};

/** Lista de exigências: um grupo de documentos que a obra pede de fornecedores de um tipo. */
export type ListaExigencias = {
  id: string;
  nome: string;
  tipo: TipoFornecimento;
  itens: readonly ItemExigido[];
};

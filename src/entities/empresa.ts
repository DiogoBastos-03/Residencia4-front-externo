import type { IsoDate, TipoFornecimento } from './common';

/** A empresa fornecedora logada. Os dados de cadastro vêm da JotaNunes. */
export type Empresa = {
  razaoSocial: string;
  /** Nome curto, como aparece na sidebar. */
  nome: string;
  cnpj: string;
  inscricaoEstadual: string;
  endereco: string;
  atividade: string;
  fornecedorDesde: IsoDate;
  /** Um ou os dois tipos. */
  tipos: readonly TipoFornecimento[];
  /** Contato e acesso: a empresa pode editar. */
  emailNotificacoes: string;
  responsavel: string;
  telefone: string;
};

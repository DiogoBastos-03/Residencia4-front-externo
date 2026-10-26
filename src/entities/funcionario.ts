import type { ArquivoEnviado, Decisao, EnvioAnterior, IsoDate } from './common';

/** Pessoa cadastrada pela empresa para trabalhar numa obra. */
export type Funcionario = {
  id: string;
  nome: string;
  /** Só dígitos. */
  cpf: string;
  /** Só dígitos. */
  telefone: string;
  funcao: string;
  obraId: string;
  alocadoDesde: IsoDate;
  remessaId: string;
};

/**
 * Um arquivo de um documento de funcionário (ex.: o ASO de uma pessoa).
 * Cada arquivo tem validade e decisão próprias.
 */
export type ArquivoFuncionario = {
  id: string;
  funcionarioId: string;
  tipoDocumentoId: string;
  status: 'aprovado' | 'emAnalise' | 'reprovado';
  validade?: IsoDate;
  arquivo: ArquivoEnviado;
  decisao?: Decisao;
  anteriores: readonly EnvioAnterior[];
};

/** Envio de várias pessoas de uma vez (até 10). */
export type Remessa = {
  id: string;
  enviadaEm: IsoDate;
  funcionarioIds: readonly string[];
};

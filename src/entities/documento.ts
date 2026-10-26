import type { ArquivoEnviado, Decisao, EnvioAnterior, IsoDate } from './common';

/** Situação do envio guardada nos dados; "vence em breve" e "vencido" são derivados da validade. */
export type StatusEnvio = 'aprovado' | 'emAnalise' | 'pendente' | 'reprovado';

/** Documento da empresa: enviado uma vez, vale para todas as obras que o exigem. */
export type DocumentoEmpresa = {
  id: string;
  tipoDocumentoId: string;
  status: StatusEnvio;
  validade?: IsoDate;
  /** Versão em vigor (ou em análise). */
  arquivo?: ArquivoEnviado;
  /** Desde quando é exigido — para o que ainda não foi enviado. */
  exigidoDesde?: IsoDate;
  decisao?: Decisao;
  /** Mais recente primeiro. */
  anteriores: readonly EnvioAnterior[];
};

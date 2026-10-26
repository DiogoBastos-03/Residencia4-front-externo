import type { Autor, IsoDate } from './common';

export type CategoriaEvento = 'envio' | 'decisao' | 'exigencia';

export type AcaoEvento =
  | 'documentoEnviado'
  | 'remessaEnviada'
  | 'documentoAprovado'
  | 'documentoReprovado'
  | 'novaExigencia'
  | 'obraVinculada';

export type EventoHistorico = {
  id: string;
  quando: IsoDate;
  acao: AcaoEvento;
  /** O que mudou, como aparece na coluna "Item". */
  item: string;
  por: Autor;
};

export const CATEGORIA: Record<AcaoEvento, CategoriaEvento> = {
  documentoEnviado: 'envio',
  remessaEnviada: 'envio',
  documentoAprovado: 'decisao',
  documentoReprovado: 'decisao',
  novaExigencia: 'exigencia',
  obraVinculada: 'exigencia',
};

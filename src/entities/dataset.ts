import type { IsoDate } from './common';
import type { DocumentoEmpresa } from './documento';
import type { Empresa } from './empresa';
import type { ArquivoFuncionario, Funcionario, Remessa } from './funcionario';
import type { EventoHistorico } from './historico';
import type { ListaExigencias, TipoDocumento } from './lista';
import type { Obra } from './obra';

/** Tudo o que o portal conhece da empresa logada. Hoje vem de mocks; amanhã, da API. */
export type Dataset = {
  /** "Hoje" do sistema — vencimentos e prazos são calculados a partir dele. */
  hoje: IsoDate;
  agora: IsoDate;
  empresa: Empresa;
  obras: readonly Obra[];
  listas: readonly ListaExigencias[];
  tiposDocumento: readonly TipoDocumento[];
  documentos: readonly DocumentoEmpresa[];
  funcionarios: readonly Funcionario[];
  arquivos: readonly ArquivoFuncionario[];
  remessas: readonly Remessa[];
  eventos: readonly EventoHistorico[];
};

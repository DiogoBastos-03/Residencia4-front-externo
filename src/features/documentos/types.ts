import type {
  ArquivoEnviado,
  Decisao,
  EnvioAnterior,
  LinhaDocumento,
  ListaExigencias,
  Obra,
  Obrigatoriedade,
  Situacao,
  contagemFuncionarios,
} from '@/entities';

export type FiltroDocumentos = 'todos' | 'pendentes' | 'analise' | 'aprovados';

export type GrupoDocumentos = {
  lista: ListaExigencias;
  obras: Obra[];
  linhas: LinhaDocumento[];
  emDia: number;
  obrigatorios: number;
  /** A lista pede documentos de funcionário: mostra a faixa "Funcionários em campo". */
  temFuncionarios: boolean;
};

export type ListaDocumentos = {
  grupos: GrupoDocumentos[];
  contagem: Record<FiltroDocumentos, number>;
  funcionarios: ReturnType<typeof contagemFuncionarios>;
};

/**
 * O que o painel mostra e o que o envio precisa — igual para documento da empresa
 * e para arquivo de funcionário.
 */
export type AlvoDocumento = {
  kind: 'documento' | 'arquivo';
  /** Id da rota: tipo de documento (empresa) ou id do arquivo (funcionário). */
  id: string;
  titulo: string;
  /** Nome da lista de exigências. */
  subtitulo: string;
  situacao: Situacao;
  obrigatoriedade: Obrigatoriedade;
  comData: boolean;
  obras: Obra[];
  tipoDocumentoId: string;
  /** Nome da pessoa, para arquivo de funcionário. */
  pessoa?: string;
  funcionarioId?: string;
  validade?: string;
  exigidoDesde?: string;
  arquivo?: ArquivoEnviado;
  decisao?: Decisao;
  anteriores: readonly EnvioAnterior[];
};

/** O que o formulário de envio manda. */
export type DadosEnvio = {
  arquivo: { nome: string; tamanhoKb: number };
  /** ISO, quando o documento tem validade. */
  validade?: string;
  tipoArquivo: string;
  observacao: string;
};

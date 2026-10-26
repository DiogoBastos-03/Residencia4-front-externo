import type { Obra, ResumoFuncionario, contagemFuncionarios } from '@/entities';
import type { ArquivoEscolhido } from '@/shared/lib';

export type FiltroFuncionarios = 'todos' | 'emDia' | 'emAnalise' | 'pendente' | 'reprovado';

export type ListaFuncionarios = {
  resumos: ResumoFuncionario[];
  contagem: ReturnType<typeof contagemFuncionarios>;
  obras: Obra[];
  /** Nome da lista de exigências que pede documentos de funcionário (para o estado vazio). */
  listaComFuncionarios: string | null;
  /** Documentos pedidos por pessoa, na ordem das listas. */
  documentosPorPessoa: Array<{ tipoDocumentoId: string; nome: string; obrigatorio: boolean }>;
};

/** Pessoa preenchida no painel de remessa, antes do envio. */
export type PessoaRemessa = {
  chave: string;
  cpf: string;
  telefone: string;
  nome: string;
  funcao: string;
  /** Arquivos anexados, por tipo de documento. */
  arquivos: Record<string, ArquivoEscolhido>;
};

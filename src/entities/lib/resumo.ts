import type { IsoDate, Situacao } from '../common';
import type { Dataset } from '../dataset';
import type { DocumentoEmpresa } from '../documento';
import type { ArquivoFuncionario, Funcionario } from '../funcionario';
import type { ItemExigido, ListaExigencias } from '../lista';
import type { Obra } from '../obra';
import { itensDaEmpresa, itensDeFuncionario, listasAplicaveis, listasDaObra, nomeCurtoDoTipo, nomeDoTipo } from './aplicabilidade';
import { ehPendencia, estaEmDia, situacaoArquivo, situacaoDocumento } from './situacao';

// — Documentos da empresa —

export type LinhaDocumento = {
  doc: DocumentoEmpresa | undefined;
  tipoDocumentoId: string;
  nome: string;
  item: ItemExigido;
  lista: ListaExigencias;
  obras: Obra[];
  situacao: Situacao;
};

export function documentoDoTipo(ds: Dataset, tipoDocumentoId: string): DocumentoEmpresa | undefined {
  return ds.documentos.find((d) => d.tipoDocumentoId === tipoDocumentoId);
}

/** Todos os documentos da empresa exigidos, com a situação de cada um. */
export function linhasDocumentos(ds: Dataset): LinhaDocumento[] {
  return itensDaEmpresa(ds).map(({ item, lista, obras }) => {
    const doc = documentoDoTipo(ds, item.tipoDocumentoId);
    return {
      doc,
      tipoDocumentoId: item.tipoDocumentoId,
      nome: nomeDoTipo(ds, item.tipoDocumentoId),
      item,
      lista,
      obras,
      situacao: situacaoDocumento(doc, ds.hoje),
    };
  });
}

/** Obrigatórios da empresa: quantos, em dia, em análise, pendentes, vencidos. */
export function metricasDocumentos(ds: Dataset) {
  const obrigatorios = linhasDocumentos(ds).filter((l) => l.item.obrigatoriedade === 'obrigatorio');
  const conta = (f: (s: Situacao) => boolean) => obrigatorios.filter((l) => f(l.situacao)).length;
  return {
    obrigatorios: obrigatorios.length,
    emDia: conta(estaEmDia),
    emAnalise: conta((s) => s === 'emAnalise'),
    pendentes: conta((s) => s === 'pendente' || s === 'reprovado'),
    vencidos: conta((s) => s === 'vencido'),
  };
}

/** Documentos da empresa com pendência — o contador do menu. */
export function pendenciasDaEmpresa(ds: Dataset): LinhaDocumento[] {
  return linhasDocumentos(ds).filter((l) => ehPendencia(l.situacao));
}

// — Funcionários —

export type ItemDaPessoa = {
  item: ItemExigido;
  nome: string;
  arquivo: ArquivoFuncionario | undefined;
  situacao: Situacao;
};

export type ResumoFuncionario = {
  funcionario: Funcionario;
  obra: Obra | undefined;
  itens: ItemDaPessoa[];
  /** Enviados e não reprovados (aprovados, vencendo ou em análise). */
  enviadosOk: number;
  total: number;
  situacao: Situacao;
};

export function arquivoDaPessoa(ds: Dataset, funcionarioId: string, tipoDocumentoId: string): ArquivoFuncionario | undefined {
  return ds.arquivos.find((a) => a.funcionarioId === funcionarioId && a.tipoDocumentoId === tipoDocumentoId);
}

/**
 * Situação da pessoa: reprovado ou vencido pesa mais; depois, documento obrigatório que falta;
 * depois, algo em análise. Um arquivo reprovado não muda a decisão dos outros.
 */
export function resumoFuncionario(ds: Dataset, funcionario: Funcionario): ResumoFuncionario {
  const itens = itensDeFuncionario(ds).map(({ item }) => {
    const arquivo = arquivoDaPessoa(ds, funcionario.id, item.tipoDocumentoId);
    return { item, nome: nomeDoTipo(ds, item.tipoDocumentoId), arquivo, situacao: situacaoArquivo(arquivo, ds.hoje) };
  });
  const tem = (s: Situacao) => itens.some((i) => i.situacao === s);
  const faltaObrigatorio = itens.some((i) => i.item.obrigatoriedade === 'obrigatorio' && i.situacao === 'pendente');
  const situacao: Situacao = tem('reprovado')
    ? 'reprovado'
    : tem('vencido')
      ? 'vencido'
      : faltaObrigatorio
        ? 'pendente'
        : tem('emAnalise')
          ? 'emAnalise'
          : tem('venceEmBreve')
            ? 'venceEmBreve'
            : 'aprovado';
  return {
    funcionario,
    obra: ds.obras.find((o) => o.id === funcionario.obraId),
    itens,
    enviadosOk: itens.filter((i) => estaEmDia(i.situacao) || i.situacao === 'emAnalise').length,
    total: itens.length,
    situacao,
  };
}

export function resumosFuncionarios(ds: Dataset): ResumoFuncionario[] {
  return ds.funcionarios.map((f) => resumoFuncionario(ds, f));
}

/** Contagem por situação, para filtros e resumos. "Em dia" junta aprovado e vence em breve. */
export function contagemFuncionarios(resumos: readonly ResumoFuncionario[]) {
  const conta = (f: (s: Situacao) => boolean) => resumos.filter((r) => f(r.situacao)).length;
  return {
    total: resumos.length,
    emDia: conta(estaEmDia),
    emAnalise: conta((s) => s === 'emAnalise'),
    pendente: conta((s) => s === 'pendente' || s === 'vencido'),
    reprovado: conta((s) => s === 'reprovado'),
  };
}

// — Obras —

export type ResumoObra = {
  obra: Obra;
  listas: ListaExigencias[];
  pendencias: LinhaDocumento[];
  funcionarios: ResumoFuncionario[];
};

/** Pendências de documentos da empresa exigidos nesta obra. */
export function resumoObra(ds: Dataset, obra: Obra): ResumoObra {
  const listas = listasDaObra(ds, obra.id);
  return {
    obra,
    listas,
    pendencias: pendenciasDaEmpresa(ds).filter((l) => l.obras.some((o) => o.id === obra.id)),
    funcionarios: resumosFuncionarios(ds).filter((r) => r.funcionario.obraId === obra.id),
  };
}

// — Início —

export type ItemAtencao =
  | { kind: 'documento'; linha: LinhaDocumento }
  | { kind: 'arquivo'; arquivo: ArquivoFuncionario; titulo: string; situacao: Situacao };

/** O que precisa de ação da empresa: documentos com pendência e arquivos de funcionário reprovados ou vencidos. */
export function precisaAtencao(ds: Dataset): ItemAtencao[] {
  const docs: ItemAtencao[] = pendenciasDaEmpresa(ds)
    .filter((l) => l.item.obrigatoriedade === 'obrigatorio')
    .map((linha) => ({ kind: 'documento', linha }));
  const arquivos: ItemAtencao[] = ds.arquivos.flatMap((arquivo) => {
    const situacao = situacaoArquivo(arquivo, ds.hoje);
    if (situacao !== 'reprovado' && situacao !== 'vencido') return [];
    return [{ kind: 'arquivo' as const, arquivo, titulo: tituloDoArquivo(ds, arquivo), situacao }];
  });
  return [...docs, ...arquivos];
}

/** "ASO — Wellington Duarte". */
export function tituloDoArquivo(ds: Dataset, arquivo: ArquivoFuncionario): string {
  const pessoa = ds.funcionarios.find((f) => f.id === arquivo.funcionarioId)?.nome ?? '';
  return `${nomeCurtoDoTipo(ds, arquivo.tipoDocumentoId)} — ${pessoa}`;
}

export type Vencimento = { id: string; titulo: string; validade: IsoDate; para: { kind: 'documento' | 'arquivo'; id: string } };

/** Próximas validades (documentos da empresa e arquivos de funcionário ainda válidos), da mais próxima. */
export function proximosVencimentos(ds: Dataset, limite = 4): Vencimento[] {
  const docs = linhasDocumentos(ds).flatMap((l) =>
    l.doc?.validade && estaEmDia(l.situacao)
      ? [{ id: l.doc.id, titulo: l.nome, validade: l.doc.validade, para: { kind: 'documento' as const, id: l.tipoDocumentoId } }]
      : [],
  );
  const arquivos = ds.arquivos.flatMap((a) =>
    a.validade && estaEmDia(situacaoArquivo(a, ds.hoje))
      ? [{ id: a.id, titulo: tituloDoArquivo(ds, a), validade: a.validade, para: { kind: 'arquivo' as const, id: a.id } }]
      : [],
  );
  return [...docs, ...arquivos].sort((a, b) => a.validade.localeCompare(b.validade)).slice(0, limite);
}

export { listasAplicaveis };

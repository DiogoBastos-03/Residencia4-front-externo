import {
  arquivoDaPessoa,
  documentoDoTipo,
  itensDaEmpresa,
  itensDeFuncionario,
  listasAplicaveis,
  nomeCurtoDoTipo,
  nomeDoTipo,
  situacaoArquivo,
  situacaoDocumento,
  type Dataset,
} from '@/entities';
import { useMemo } from 'react';
import { datasetStore } from '@/mocks';
import { useStore, type QueryResult } from '@/shared/lib';
import type { AlvoDocumento } from '../types';

/** Documento da empresa (id = tipo de documento) ou arquivo de funcionário (id = id do arquivo). */
/** Arquivo de um documento de funcionário — existindo ou não (ainda não enviado). */
export function alvoArquivo(ds: Dataset, funcionarioId: string, tipoDocumentoId: string): AlvoDocumento | null {
  const pessoa = ds.funcionarios.find((f) => f.id === funcionarioId);
  const exigido = itensDeFuncionario(ds).find((i) => i.item.tipoDocumentoId === tipoDocumentoId);
  if (!pessoa || !exigido) return null;
  const arquivo = arquivoDaPessoa(ds, funcionarioId, tipoDocumentoId);
  const obras = listasAplicaveis(ds).find((a) => a.lista.id === exigido.lista.id)?.obras ?? [];
  return {
    kind: 'arquivo',
    id: arquivo?.id ?? `arq-${funcionarioId}-${tipoDocumentoId}`,
    tipoDocumentoId,
    titulo: `${nomeCurtoDoTipo(ds, tipoDocumentoId)} — ${pessoa.nome}`,
    subtitulo: exigido.lista.nome,
    situacao: situacaoArquivo(arquivo, ds.hoje),
    obrigatoriedade: exigido.item.obrigatoriedade,
    comData: exigido.item.validade === 'comData',
    obras: obras.filter((o) => o.id === pessoa.obraId),
    pessoa: pessoa.nome,
    funcionarioId: pessoa.id,
    validade: arquivo?.validade,
    arquivo: arquivo?.arquivo,
    decisao: arquivo?.decisao,
    anteriores: arquivo?.anteriores ?? [],
  };
}

export function carregarDocumento(ds: Dataset, id: string): AlvoDocumento | null {
  const arquivo = ds.arquivos.find((a) => a.id === id);
  if (arquivo) return alvoArquivo(ds, arquivo.funcionarioId, arquivo.tipoDocumentoId);
  const exigido = itensDaEmpresa(ds).find((i) => i.item.tipoDocumentoId === id);
  if (!exigido) return null;
  const doc = documentoDoTipo(ds, id);
  return {
    kind: 'documento',
    id,
    tipoDocumentoId: id,
    titulo: nomeDoTipo(ds, id),
    subtitulo: exigido.lista.nome,
    situacao: situacaoDocumento(doc, ds.hoje),
    obrigatoriedade: exigido.item.obrigatoriedade,
    comData: exigido.item.validade === 'comData',
    obras: exigido.obras,
    validade: doc?.validade,
    exigidoDesde: doc?.exigidoDesde,
    arquivo: doc?.arquivo,
    decisao: doc?.decisao,
    anteriores: doc?.anteriores ?? [],
  };
}

const NADA = () => undefined;

/**
 * Documento do painel lateral. Lê na hora (o painel abre sobre a lista já carregada),
 * mas mantém o contrato { data, isLoading, error, refetch } dos hooks de leitura.
 */
export function useDocumento(id: string | undefined): QueryResult<AlvoDocumento | null> {
  const ds = useStore(datasetStore);
  const data = useMemo(() => (id ? carregarDocumento(ds, id) : null), [ds, id]);
  return { data, isLoading: false, error: null, refetch: NADA };
}

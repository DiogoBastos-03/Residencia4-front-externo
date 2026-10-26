import { contagemFuncionarios, itensDeFuncionario, nomeDoTipo, resumosFuncionarios, type Dataset } from '@/entities';
import { useDatasetQuery } from '@/mocks';
import type { ListaFuncionarios } from '../types';

export function carregarFuncionarios(ds: Dataset): ListaFuncionarios {
  const resumos = resumosFuncionarios(ds);
  const itens = itensDeFuncionario(ds);
  return {
    resumos,
    contagem: contagemFuncionarios(resumos),
    obras: [...ds.obras],
    listaComFuncionarios: itens[0]?.lista.nome ?? null,
    documentosPorPessoa: itens.map(({ item }) => ({
      tipoDocumentoId: item.tipoDocumentoId,
      nome: nomeDoTipo(ds, item.tipoDocumentoId),
      obrigatorio: item.obrigatoriedade === 'obrigatorio',
    })),
  };
}

export function useFuncionarios() {
  return useDatasetQuery('funcionarios', carregarFuncionarios, {
    empty: { resumos: [], contagem: { total: 0, emDia: 0, emAnalise: 0, pendente: 0, reprovado: 0 }, obras: [], listaComFuncionarios: null, documentosPorPessoa: [] },
  });
}

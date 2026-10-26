import { contagemFuncionarios, estaEmDia, linhasDocumentos, listasAplicaveis, pendenciasDaEmpresa, resumosFuncionarios, type Dataset } from '@/entities';
import { useDatasetQuery } from '@/mocks';
import type { ListaDocumentos } from '../types';

export function carregarDocumentos(ds: Dataset): ListaDocumentos {
  const linhas = linhasDocumentos(ds);
  const grupos = listasAplicaveis(ds).map(({ lista, obras }) => {
    const doGrupo = linhas.filter((l) => l.lista.id === lista.id);
    const obrigatorios = doGrupo.filter((l) => l.item.obrigatoriedade === 'obrigatorio');
    return {
      lista,
      obras,
      linhas: doGrupo,
      emDia: obrigatorios.filter((l) => estaEmDia(l.situacao)).length,
      obrigatorios: obrigatorios.length,
      temFuncionarios: lista.itens.some((i) => i.escopo === 'funcionario'),
    };
  });
  return {
    grupos,
    contagem: {
      todos: linhas.length,
      pendentes: linhas.filter((l) => l.situacao === 'pendente' || l.situacao === 'vencido' || l.situacao === 'reprovado').length,
      analise: linhas.filter((l) => l.situacao === 'emAnalise').length,
      aprovados: linhas.filter((l) => l.situacao === 'aprovado').length,
    },
    funcionarios: contagemFuncionarios(resumosFuncionarios(ds)),
  };
}

const VAZIO: ListaDocumentos = {
  grupos: [],
  contagem: { todos: 0, pendentes: 0, analise: 0, aprovados: 0 },
  funcionarios: { total: 0, emDia: 0, emAnalise: 0, pendente: 0, reprovado: 0 },
};

export function useDocumentos() {
  return useDatasetQuery('documentos', carregarDocumentos, { empty: VAZIO });
}

/** Documentos da empresa com pendência — o contador do item "Documentos" no menu. */
export function useContadorPendencias() {
  return useDatasetQuery('contador-pendencias', (ds) => pendenciasDaEmpresa(ds).length, { simulate: false });
}

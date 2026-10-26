import { contagemFuncionarios, estaEmDia, itensDaEmpresa, linhasDocumentos, nomeCurtoDoTipo, resumoObra, type Dataset, type ResumoObra, type Situacao } from '@/entities';
import { useDatasetQuery } from '@/mocks';

export function useObras() {
  return useDatasetQuery('obras', (ds) => ds.obras.map((o) => resumoObra(ds, o)), { empty: [] });
}

export type ListaNaObra = {
  id: string;
  nome: string;
  tipo: 'servico' | 'material';
  obrigatorios: number;
  opcionais: number;
  itensFuncionario: number;
  emDia: number;
};

export type FichaObra = ResumoObra & {
  documentosExigidos: number;
  listasNaObra: ListaNaObra[];
  /** "FGTS" vencido, "PCMSO" pendente… para o resumo da métrica. */
  pendenciasCurtas: Array<{ curto: string; situacao: Situacao }>;
  contagemFuncionarios: ReturnType<typeof contagemFuncionarios>;
};

export function carregarObra(ds: Dataset, id: string): FichaObra | null {
  const obra = ds.obras.find((o) => o.id === id);
  if (!obra) return null;
  const resumo = resumoObra(ds, obra);
  const linhas = linhasDocumentos(ds);
  const listasNaObra = resumo.listas.map((lista) => {
    const daLista = linhas.filter((l) => l.lista.id === lista.id);
    const obrigatorias = daLista.filter((l) => l.item.obrigatoriedade === 'obrigatorio');
    return {
      id: lista.id,
      nome: lista.nome,
      tipo: lista.tipo,
      obrigatorios: obrigatorias.length,
      opcionais: daLista.length - obrigatorias.length,
      itensFuncionario: lista.itens.filter((i) => i.escopo === 'funcionario').length,
      emDia: obrigatorias.filter((l) => estaEmDia(l.situacao)).length,
    };
  });
  const tipos = new Set(listasNaObra.map((l) => l.id));
  return {
    ...resumo,
    documentosExigidos: itensDaEmpresa(ds).filter((i) => tipos.has(i.lista.id) && i.item.obrigatoriedade === 'obrigatorio').length,
    listasNaObra,
    pendenciasCurtas: resumo.pendencias.map((l) => ({ curto: nomeCurtoDoTipo(ds, l.tipoDocumentoId), situacao: l.situacao })),
    contagemFuncionarios: contagemFuncionarios(resumo.funcionarios),
  };
}

export function useObra(id: string) {
  return useDatasetQuery(`obra-${id}`, (ds) => carregarObra(ds, id));
}

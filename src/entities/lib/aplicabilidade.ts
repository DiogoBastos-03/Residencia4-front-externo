import type { Dataset } from '../dataset';
import type { ItemExigido, ListaExigencias } from '../lista';
import type { Obra } from '../obra';

export type ListaAplicavel = { lista: ListaExigencias; obras: Obra[] };

/**
 * Listas de exigências que valem para a empresa: as das obras dela, de um tipo que ela fornece.
 * Lista de outro tipo simplesmente não aparece.
 */
export function listasAplicaveis(ds: Dataset): ListaAplicavel[] {
  return ds.listas.flatMap((lista) => {
    if (!ds.empresa.tipos.includes(lista.tipo)) return [];
    const obras = ds.obras.filter((o) => o.listaIds.includes(lista.id));
    return obras.length > 0 ? [{ lista, obras }] : [];
  });
}

/** Listas aplicáveis numa obra. */
export function listasDaObra(ds: Dataset, obraId: string): ListaExigencias[] {
  return listasAplicaveis(ds)
    .filter((a) => a.obras.some((o) => o.id === obraId))
    .map((a) => a.lista);
}

export type ItemDaEmpresa = { item: ItemExigido; lista: ListaExigencias; obras: Obra[] };

/** Documentos da empresa exigidos, um por tipo de documento. */
export function itensDaEmpresa(ds: Dataset): ItemDaEmpresa[] {
  const vistos = new Set<string>();
  return listasAplicaveis(ds).flatMap(({ lista, obras }) =>
    lista.itens.flatMap((item) => {
      if (item.escopo !== 'empresa' || vistos.has(item.tipoDocumentoId)) return [];
      vistos.add(item.tipoDocumentoId);
      return [{ item, lista, obras }];
    }),
  );
}

/** Documentos pedidos de cada funcionário (um arquivo por pessoa). */
export function itensDeFuncionario(ds: Dataset): Array<{ item: ItemExigido; lista: ListaExigencias }> {
  const vistos = new Set<string>();
  return listasAplicaveis(ds).flatMap(({ lista }) =>
    lista.itens.flatMap((item) => {
      if (item.escopo !== 'funcionario' || vistos.has(item.tipoDocumentoId)) return [];
      vistos.add(item.tipoDocumentoId);
      return [{ item, lista }];
    }),
  );
}

export function nomeDoTipo(ds: Dataset, tipoDocumentoId: string): string {
  return ds.tiposDocumento.find((t) => t.id === tipoDocumentoId)?.nome ?? tipoDocumentoId;
}

export function nomeCurtoDoTipo(ds: Dataset, tipoDocumentoId: string): string {
  const tipo = ds.tiposDocumento.find((t) => t.id === tipoDocumentoId);
  return tipo?.curto ?? tipo?.nome ?? tipoDocumentoId;
}

import { useCallback } from 'react';
import type { ArquivoEnviado, ArquivoFuncionario, Dataset, EnvioAnterior, EventoHistorico } from '@/entities';
import { tituloDoArquivo, nomeDoTipo } from '@/entities';
import { datasetStore } from '@/mocks';
import type { AlvoDocumento, DadosEnvio } from '../types';

function anterior(arquivo: ArquivoEnviado | undefined, reprovado: boolean): EnvioAnterior[] {
  return arquivo ? [{ arquivo: arquivo.nome, enviadoEm: arquivo.enviadoEm.slice(0, 10), resultado: reprovado ? 'reprovado' : 'aprovado' }] : [];
}

function evento(ds: Dataset, item: string): EventoHistorico {
  return { id: `ev-${ds.eventos.length + 1}-${ds.agora}`, quando: ds.agora, acao: 'documentoEnviado', item, por: { kind: 'voce' } };
}

/**
 * Envio, renovação e reenvio. Alteram os dados em memória: o documento passa a "em análise",
 * a versão anterior vai para "envios anteriores" e o histórico ganha o evento.
 */
export function useAcoesEnvio() {
  const enviar = useCallback((alvo: Pick<AlvoDocumento, 'kind' | 'id' | 'tipoDocumentoId' | 'funcionarioId'>, dados: DadosEnvio) => {
    datasetStore.set((ds) => {
      const novo: ArquivoEnviado = { nome: dados.arquivo.nome, tamanhoKb: dados.arquivo.tamanhoKb, enviadoEm: ds.agora };
      if (alvo.kind === 'arquivo') {
        const atual = ds.arquivos.find((a) => a.id === alvo.id);
        if (!atual) {
          // Primeiro envio deste documento da pessoa.
          if (!alvo.funcionarioId) return ds;
          const criado: ArquivoFuncionario = {
            id: alvo.id,
            funcionarioId: alvo.funcionarioId,
            tipoDocumentoId: alvo.tipoDocumentoId,
            status: 'emAnalise',
            validade: dados.validade,
            arquivo: novo,
            anteriores: [],
          };
          return { ...ds, arquivos: [...ds.arquivos, criado], eventos: [evento(ds, tituloDoArquivo(ds, criado)), ...ds.eventos] };
        }
        return {
          ...ds,
          arquivos: ds.arquivos.map((a) =>
            a.id === alvo.id
              ? { ...a, status: 'emAnalise', arquivo: novo, validade: dados.validade, decisao: undefined, anteriores: [...anterior(a.arquivo, a.status === 'reprovado'), ...a.anteriores] }
              : a,
          ),
          eventos: [evento(ds, tituloDoArquivo(ds, atual)), ...ds.eventos],
        };
      }
      const existe = ds.documentos.some((d) => d.tipoDocumentoId === alvo.id);
      const documentos = existe
        ? ds.documentos.map((d) =>
            d.tipoDocumentoId === alvo.id
              ? {
                  ...d,
                  status: 'emAnalise' as const,
                  arquivo: novo,
                  validade: dados.validade,
                  decisao: undefined,
                  exigidoDesde: undefined,
                  anteriores: [...anterior(d.arquivo, d.status === 'reprovado'), ...d.anteriores],
                }
              : d,
          )
        : [...ds.documentos, { id: `doc-${alvo.id}`, tipoDocumentoId: alvo.id, status: 'emAnalise' as const, arquivo: novo, validade: dados.validade, anteriores: [] }];
      return { ...ds, documentos, eventos: [evento(ds, nomeDoTipo(ds, alvo.id)), ...ds.eventos] };
    });
  }, []);

  return { enviar };
}

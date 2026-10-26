import { useCallback } from 'react';
import type { ArquivoFuncionario, Funcionario, Remessa } from '@/entities';
import { datasetStore } from '@/mocks';
import { strings } from '@/shared/strings';
import type { PessoaRemessa } from '../types';

function slug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Envia a remessa inteira de uma vez: cadastra as pessoas na obra e manda os arquivos
 * anexados para análise. O que não foi anexado fica pendente — nada é bloqueado.
 */
export function useAcoesRemessa() {
  const enviarRemessa = useCallback((obraId: string, pessoas: readonly PessoaRemessa[]) => {
    datasetStore.set((ds) => {
      const remessaId = `rem-${ds.remessas.length + 1}`;
      const usados = new Set(ds.funcionarios.map((f) => f.id));
      const novos: Funcionario[] = [];
      const arquivos: ArquivoFuncionario[] = [];
      for (const p of pessoas) {
        const base = slug(p.nome) || p.cpf;
        let id = base;
        for (let n = 2; usados.has(id); n++) id = `${base}-${n}`;
        usados.add(id);
        novos.push({ id, nome: p.nome.trim(), cpf: p.cpf, telefone: p.telefone, funcao: p.funcao, obraId, alocadoDesde: ds.hoje, remessaId });
        for (const [tipo, arquivo] of Object.entries(p.arquivos)) {
          arquivos.push({
            id: `arq-${id}-${tipo}`,
            funcionarioId: id,
            tipoDocumentoId: tipo,
            status: 'emAnalise',
            arquivo: { nome: arquivo.nome, tamanhoKb: arquivo.tamanhoKb, enviadoEm: ds.agora },
            anteriores: [],
          });
        }
      }
      const remessa: Remessa = { id: remessaId, enviadaEm: ds.agora, funcionarioIds: novos.map((f) => f.id) };
      return {
        ...ds,
        funcionarios: [...ds.funcionarios, ...novos],
        arquivos: [...ds.arquivos, ...arquivos],
        remessas: [...ds.remessas, remessa],
        eventos: [
          { id: `ev-${remessaId}`, quando: ds.agora, acao: 'remessaEnviada', item: strings.pages.funcionarios.painel.remessa(novos.length), por: { kind: 'voce' } },
          ...ds.eventos,
        ],
      };
    });
  }, []);

  return { enviarRemessa };
}

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { estaEmDia, type ResumoFuncionario } from '@/entities';
import type { FiltroFuncionarios } from '../types';

const FILTROS: readonly FiltroFuncionarios[] = ['todos', 'emDia', 'emAnalise', 'pendente', 'reprovado'];

export type FiltrosFuncionarios = { situacao: FiltroFuncionarios; obra: string; busca: string };

function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function filtrarFuncionarios(resumos: readonly ResumoFuncionario[], f: FiltrosFuncionarios): ResumoFuncionario[] {
  const termo = normalizar(f.busca.trim());
  const digitos = f.busca.replace(/\D/g, '');
  return resumos.filter((r) => {
    const s = r.situacao;
    if (f.situacao === 'emDia' && !estaEmDia(s)) return false;
    if (f.situacao === 'emAnalise' && s !== 'emAnalise') return false;
    if (f.situacao === 'pendente' && s !== 'pendente' && s !== 'vencido') return false;
    if (f.situacao === 'reprovado' && s !== 'reprovado') return false;
    if (f.obra && r.funcionario.obraId !== f.obra) return false;
    if (!termo) return true;
    return normalizar(r.funcionario.nome).includes(termo) || (digitos.length >= 3 && r.funcionario.cpf.includes(digitos));
  });
}

/** Situação, obra e busca na URL (?situacao=&obra=&busca=). */
export function useFiltrosFuncionarios() {
  const [params, setParams] = useSearchParams();
  const filtros = useMemo<FiltrosFuncionarios>(
    () => ({
      situacao: FILTROS.find((f) => f === params.get('situacao')) ?? 'todos',
      obra: params.get('obra') ?? '',
      busca: params.get('busca') ?? '',
    }),
    [params],
  );
  const atualizar = useCallback(
    (parcial: Partial<FiltrosFuncionarios>) =>
      setParams(
        (atual) => {
          const p = new URLSearchParams(atual);
          for (const [chave, valor] of Object.entries(parcial)) {
            if (valor === undefined) continue;
            if (valor === '' || valor === 'todos') p.delete(chave);
            else p.set(chave, valor);
          }
          return p;
        },
        { replace: true },
      ),
    [setParams],
  );
  const ativo = filtros.situacao !== 'todos' || filtros.obra !== '' || filtros.busca !== '';
  return { filtros, atualizar, limpar: () => atualizar({ situacao: 'todos', obra: '', busca: '' }), ativo };
}

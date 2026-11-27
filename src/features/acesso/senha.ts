import { problemaSenha } from '@/shared/lib';
import { strings } from '@/shared/strings';

const t = strings.pages.acesso.senha;

export type ErrosNovaSenha = Partial<Record<'nova' | 'confirmacao', string>>;

/** Confere a nova senha contra a política da API e a confirmação contra a nova. */
export function validarNovaSenha(nova: string, confirmacao: string): ErrosNovaSenha {
  const problema = problemaSenha(nova);
  return {
    nova: problema ? t.problema[problema] : undefined,
    confirmacao: !problema && confirmacao !== nova ? t.confirmacaoErro : undefined,
  };
}

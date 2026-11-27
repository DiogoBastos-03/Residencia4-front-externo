import { createStore } from '@/shared/lib';

export type Sessao = {
  accessToken: string;
  refreshToken: string;
  /** ISO 8601, em UTC. */
  accessTokenExpiresAt: string;
  /** A senha ainda é a provisória: o portal só libera depois da troca no primeiro acesso. */
  senhaProvisoria: boolean;
};

const CHAVE = 'portal-fornecedor:sessao';
/** Renova um pouco antes de vencer, para a requisição não chegar com o token expirado. */
const MARGEM_MS = 30_000;

function ler(): Sessao | null {
  try {
    const salvo = localStorage.getItem(CHAVE);
    return salvo ? (JSON.parse(salvo) as Sessao) : null;
  } catch {
    return null;
  }
}

function gravar(sessao: Sessao | null) {
  try {
    if (sessao) localStorage.setItem(CHAVE, JSON.stringify(sessao));
    else localStorage.removeItem(CHAVE);
  } catch {
    // Sem localStorage (aba privada, bloqueio): a sessão vale só enquanto a página estiver aberta.
  }
}

/** Sessão da empresa, guardada no localStorage para sobreviver ao F5 e ao fechar o navegador. */
export const sessaoStore = createStore<Sessao | null>(ler());

sessaoStore.subscribe(() => gravar(sessaoStore.get()));

// Entrar ou sair em outra aba vale para esta também.
window.addEventListener('storage', (event) => {
  if (event.key === CHAVE) sessaoStore.set(() => ler());
});

export function salvarSessao(sessao: Sessao) {
  sessaoStore.set(() => sessao);
}

export function atualizarSessao(parcial: Partial<Sessao>) {
  sessaoStore.set((atual) => (atual ? { ...atual, ...parcial } : atual));
}

export function encerrarSessao() {
  sessaoStore.set(() => null);
}

export function acessoExpirado(sessao: Sessao): boolean {
  return Date.parse(sessao.accessTokenExpiresAt) - MARGEM_MS <= Date.now();
}

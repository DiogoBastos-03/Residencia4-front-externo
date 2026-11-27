import axios, { type InternalAxiosRequestConfig } from 'axios';
import { codigoDoErro } from './problema';
import { encerrarSessao, salvarSessao, sessaoStore, type Sessao } from './sessao';

/** Cliente HTTP do portal. Põe o Bearer da sessão e renova o token quando a API responde 401. */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

type RespostaRefresh = { accessToken: string; refreshToken: string; accessTokenExpiresAt: string };

let renovacao: Promise<Sessao> | null = null;

/**
 * Troca o refresh token por um par novo. Chamadas simultâneas compartilham a mesma renovação.
 * Se a API recusar o refresh (401/403), a sessão é encerrada e é preciso entrar de novo.
 */
export function renovarSessao(): Promise<Sessao> {
  renovacao ??= (async () => {
    const atual = sessaoStore.get();
    if (!atual) throw new Error('Sem sessão para renovar.');
    try {
      const { data } = await api.post<RespostaRefresh>('/api/v1/auth/refresh', { refreshToken: atual.refreshToken });
      const nova = { ...atual, ...data };
      salvarSessao(nova);
      return nova;
    } catch (erro) {
      const codigo = codigoDoErro(erro);
      if (codigo === 'INVALID_REFRESH_TOKEN' || codigo === 'ENTERPRISE_INACTIVE') encerrarSessao();
      throw erro;
    }
  })().finally(() => {
    renovacao = null;
  });
  return renovacao;
}

api.interceptors.request.use((config) => {
  const sessao = sessaoStore.get();
  if (sessao && !config.headers.Authorization) config.headers.Authorization = `Bearer ${sessao.accessToken}`;
  return config;
});

type ConfigComRetentativa = InternalAxiosRequestConfig & { _renovado?: boolean };

api.interceptors.response.use(undefined, async (erro) => {
  const config = erro.config as ConfigComRetentativa | undefined;
  // Só o 401 de rota protegida renova; o 401 de credencial errada (login, senha atual) não.
  if (!config || config._renovado || codigoDoErro(erro) !== 'UNAUTHENTICATED' || !sessaoStore.get()) throw erro;
  config._renovado = true;
  const sessao = await renovarSessao();
  config.headers.Authorization = `Bearer ${sessao.accessToken}`;
  return api(config);
});

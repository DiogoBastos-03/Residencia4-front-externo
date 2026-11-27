import { api } from './client';

/** Rotas de autenticação — contrato em auth-contract.md. */
const BASE = '/api/v1/auth';

export type RespostaLogin = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  passwordIsProvisional: boolean;
};

export async function login(cnpj: string, password: string): Promise<RespostaLogin> {
  const { data } = await api.post<RespostaLogin>(`${BASE}/login`, { cnpj, password });
  return data;
}

export async function trocarSenhaPrimeiroAcesso(currentPassword: string, newPassword: string, newPasswordConfirmation: string) {
  await api.post(`${BASE}/change-password-first-access`, { currentPassword, newPassword, newPasswordConfirmation });
}

/** Sempre 204, exista ou não o CNPJ. */
export async function solicitarCodigo(cnpj: string) {
  await api.post(`${BASE}/forgot-password`, { cnpj });
}

export async function validarCodigo(cnpj: string, code: string): Promise<{ resetToken: string; expiresInSeconds: number }> {
  const { data } = await api.post<{ resetToken: string; expiresInSeconds: number }>(`${BASE}/validate-code`, { cnpj, code });
  return data;
}

export async function redefinirSenha(resetToken: string, newPassword: string, newPasswordConfirmation: string) {
  await api.post(`${BASE}/reset-password`, { resetToken, newPassword, newPasswordConfirmation });
}

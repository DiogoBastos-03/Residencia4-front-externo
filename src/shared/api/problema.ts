import { isAxiosError } from 'axios';

/** Corpo de erro da API (RFC 9457). Decida pelo `code`; o `title` pode mudar. */
export type ProblemDetails = {
  type?: string;
  title?: string;
  status: number;
  code?: string;
  traceId?: string;
  /** Só em `VALIDATION_ERROR`: mensagens por campo. */
  errors?: Record<string, string[]>;
};

export type Problema = ProblemDetails & {
  /** `Retry-After` do 429, em segundos. */
  retryAfter?: number;
};

/** Lê o erro de uma chamada à API. `null` quando não houve resposta (rede, CORS, servidor fora). */
export function lerProblema(erro: unknown): Problema | null {
  if (!isAxiosError(erro) || !erro.response) return null;
  const { status, data, headers } = erro.response;
  const corpo = (data && typeof data === 'object' ? data : {}) as Partial<ProblemDetails>;
  const retryAfter = Number(headers['retry-after']);
  return { ...corpo, status, ...(Number.isFinite(retryAfter) && { retryAfter }) };
}

export function codigoDoErro(erro: unknown): string | undefined {
  return lerProblema(erro)?.code;
}

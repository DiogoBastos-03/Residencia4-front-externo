import { lerProblema } from '@/shared/api';
import { strings } from '@/shared/strings';

const t = strings.pages.acesso.erros;

/**
 * Mensagem para o erro de uma chamada de acesso. `porCodigo` traduz os códigos da rota;
 * o resto cai nas mensagens comuns (conexão, rate limit, empresa inativa, genérico).
 */
export function mensagemDeErro(erro: unknown, porCodigo: Partial<Record<string, string>> = {}): string {
  const problema = lerProblema(erro);
  if (!problema) return t.conexao;
  const traduzida = problema.code && porCodigo[problema.code];
  if (traduzida) return traduzida;
  if (problema.code === 'TOO_MANY_REQUESTS' || problema.status === 429) return t.muitasTentativas(problema.retryAfter);
  if (problema.code === 'ENTERPRISE_INACTIVE') return t.empresaInativa;
  return t.generico;
}

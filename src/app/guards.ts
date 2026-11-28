import { redirect } from 'react-router';
import { acessoExpirado, renovarSessao, sessaoStore, type Sessao } from '@/shared/api';
import { paths } from '@/shared/lib';

/** Sessão com o access token válido, renovando se preciso. `null` se não há sessão ou o refresh falhou. */
async function sessaoValida(): Promise<Sessao | null> {
  const sessao = sessaoStore.get();
  if (!sessao) return null;
  if (!acessoExpirado(sessao)) return sessao;
  try {
    return await renovarSessao();
  } catch {
    return null;
  }
}

/** Telas do portal: exige login e a senha provisória já trocada. */
export async function exigirSessao() {
  const sessao = await sessaoValida();
  if (!sessao) throw redirect(paths.entrar);
  if (sessao.senhaProvisoria) throw redirect(paths.primeiroAcesso);
  return null;
}

/** Primeiro acesso: só para quem entrou e ainda está com a senha provisória. */
export async function exigirSenhaProvisoria() {
  const sessao = await sessaoValida();
  if (!sessao) throw redirect(paths.entrar);
  if (!sessao.senhaProvisoria) throw redirect(paths.inicio);
  return null;
}

/** Entrar: quem já tem sessão válida vai direto para o portal. */
export function apenasVisitante() {
  const sessao = sessaoStore.get();
  if (sessao && !acessoExpirado(sessao)) throw redirect(sessao.senhaProvisoria ? paths.primeiroAcesso : paths.inicio);
  return null;
}

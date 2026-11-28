import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { atualizarSessao, authApi, codigoDoErro, encerrarSessao, lerProblema } from '@/shared/api';
import { paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AlertBox, Button, Field, Input, Stack, useToast } from '@/shared/ui';
import { mensagemDeErro } from '../erros';
import { validarNovaSenha } from '../senha';

const t = strings.pages.acesso.primeiroAcesso;
const ts = strings.pages.acesso.senha;

type Erros = Partial<Record<'atual' | 'nova' | 'confirmacao', string>>;

/** Troca da senha provisória (POST /auth/change-password-first-access). Só depois dela o portal abre. */
export function PrimeiroAcessoForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [erroTopo, setErroTopo] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function liberarPortal() {
    atualizarSessao({ senhaProvisoria: false });
    navigate(paths.inicio, { replace: true });
  }

  async function salvar(event: FormEvent) {
    event.preventDefault();
    const novos: Erros = { atual: atual ? undefined : t.atualErro, ...validarNovaSenha(nova, confirmacao) };
    setErros(novos);
    setErroTopo(null);
    if (Object.values(novos).some(Boolean)) return;
    setEnviando(true);
    try {
      await authApi.trocarSenhaPrimeiroAcesso(atual, nova, confirmacao);
      showToast(t.sucesso);
      liberarPortal();
    } catch (erro) {
      setEnviando(false);
      switch (codigoDoErro(erro)) {
        case 'PASSWORD_NOT_PROVISIONAL':
          liberarPortal();
          return;
        case 'UNAUTHENTICATED':
          encerrarSessao();
          navigate(paths.entrar, { replace: true });
          return;
        case 'INVALID_CREDENTIALS':
          setErros({ atual: t.atualIncorreta });
          return;
        case 'NEW_PASSWORD_MUST_DIFFER':
          setErros({ nova: t.deveDiferir });
          return;
        case 'WEAK_PASSWORD':
          setErros({ nova: lerProblema(erro)?.title ?? ts.regras });
          return;
        default:
          setErroTopo(mensagemDeErro(erro));
      }
    }
  }

  function sair() {
    encerrarSessao();
    navigate(paths.entrar, { replace: true });
  }

  return (
    <form noValidate onSubmit={salvar}>
      <Stack gap="lg">
        {erroTopo && (
          <AlertBox variant="error" withIcon>
            {erroTopo}
          </AlertBox>
        )}
        <Field label={t.atual} hint={t.atualHint} error={erros.atual}>
          {(control) => <Input {...control} type="password" autoComplete="current-password" value={atual} onChange={(e) => setAtual(e.target.value)} />}
        </Field>
        <Field label={ts.novaSenha} hint={ts.regras} error={erros.nova}>
          {(control) => <Input {...control} type="password" autoComplete="new-password" value={nova} onChange={(e) => setNova(e.target.value)} />}
        </Field>
        <Field label={ts.confirmacao} error={erros.confirmacao}>
          {(control) => (
            <Input {...control} type="password" autoComplete="new-password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} />
          )}
        </Field>
        <Button variant="primary" type="submit" fullWidth disabled={enviando}>
          {enviando ? t.salvando : t.salvar}
        </Button>
        <Button variant="tertiary" fullWidth onClick={sair}>
          {t.sair}
        </Button>
      </Stack>
    </form>
  );
}

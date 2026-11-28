import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { authApi, salvarSessao } from '@/shared/api';
import { cnpjValido, formatCnpj, paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AlertBox, Button, Field, Input, Stack, Text } from '@/shared/ui';
import { mensagemDeErro } from '../erros';

const t = strings.pages.acesso.entrar;

type Erros = Partial<Record<'cnpj' | 'senha', string>>;

/** Entrada por CNPJ e senha (POST /auth/login). Com senha provisória, segue para o primeiro acesso. */
export function EntrarForm() {
  const navigate = useNavigate();
  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [erroTopo, setErroTopo] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(event: FormEvent) {
    event.preventDefault();
    const novos: Erros = { cnpj: cnpjValido(cnpj) ? undefined : t.cnpjErro, senha: senha ? undefined : t.senhaErro };
    setErros(novos);
    setErroTopo(null);
    if (Object.values(novos).some(Boolean)) return;
    setEnviando(true);
    try {
      const resposta = await authApi.login(cnpj, senha);
      salvarSessao({
        accessToken: resposta.accessToken,
        refreshToken: resposta.refreshToken,
        accessTokenExpiresAt: resposta.accessTokenExpiresAt,
        senhaProvisoria: resposta.passwordIsProvisional,
      });
      navigate(resposta.passwordIsProvisional ? paths.primeiroAcesso : paths.inicio, { replace: true });
    } catch (erro) {
      setErroTopo(mensagemDeErro(erro, { INVALID_CREDENTIALS: t.erroCredenciais }));
      setEnviando(false);
    }
  }

  return (
    <form noValidate onSubmit={entrar}>
      <Stack gap="lg">
        {erroTopo && (
          <AlertBox variant="error" withIcon>
            {erroTopo}
          </AlertBox>
        )}
        <Field label={t.cnpj} error={erros.cnpj}>
          {(control) => (
            <Input
              {...control}
              mono
              inputMode="numeric"
              autoComplete="username"
              placeholder={t.cnpjPlaceholder}
              value={formatCnpj(cnpj)}
              onChange={(e) => setCnpj(e.target.value.replace(/\D/g, '').slice(0, 14))}
            />
          )}
        </Field>
        <Field label={t.senha} error={erros.senha}>
          {(control) => <Input {...control} type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} />}
        </Field>
        <Button variant="primary" type="submit" fullWidth disabled={enviando}>
          {enviando ? t.entrando : t.entrar}
        </Button>
        <Link to={paths.esqueciSenha} className="focus-ring self-center rounded-control text-support font-semibold text-ink-2 underline-offset-2 hover:underline max-md:min-h-tap max-md:leading-[44px]">
          {t.esqueci}
        </Link>
        <Text size="support" tone="muted" className="text-center">
          {t.ajuda}
        </Text>
      </Stack>
    </form>
  );
}

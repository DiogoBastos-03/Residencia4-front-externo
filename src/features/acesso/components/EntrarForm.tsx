import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { datasetStore } from '@/mocks';
import { cnpjValido, formatCnpj, paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AlertBox, Button, Field, Input, Stack, Text } from '@/shared/ui';

const t = strings.pages.acesso.entrar;

type Erros = Partial<Record<'cnpj' | 'senha', string>>;

/**
 * Entrada por CNPJ e senha. Nesta etapa (sem API) entra com o CNPJ da empresa de demonstração
 * e qualquer senha; outro CNPJ mostra o erro de credencial.
 */
export function EntrarForm() {
  const navigate = useNavigate();
  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [erroTopo, setErroTopo] = useState<string | null>(null);

  function entrar(event: FormEvent) {
    event.preventDefault();
    const novos: Erros = { cnpj: cnpjValido(cnpj) ? undefined : t.cnpjErro, senha: senha ? undefined : t.senhaErro };
    setErros(novos);
    setErroTopo(null);
    if (Object.values(novos).some(Boolean)) return;
    if (cnpj !== datasetStore.get().empresa.cnpj) {
      setErroTopo(t.erroCredenciais);
      return;
    }
    navigate(paths.inicio);
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
        <Button variant="primary" type="submit" fullWidth>
          {t.entrar}
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

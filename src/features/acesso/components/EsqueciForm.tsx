import { useState, type FormEvent } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { emailValido, paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { Button, ButtonLink, Field, Icon, Input, Stack, Text } from '@/shared/ui';

const t = strings.pages.acesso.esqueci;

/** Pede o e-mail e confirma o envio do link. Não diz se o e-mail existe (não vaza quem é cliente). */
export function EsqueciForm() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState<string | undefined>();
  const [enviado, setEnviado] = useState<string | null>(null);

  function enviar(event: FormEvent) {
    event.preventDefault();
    if (!emailValido(email)) {
      setErro(t.emailErro);
      return;
    }
    setEnviado(email.trim());
  }

  if (enviado) {
    return (
      <Stack gap="lg">
        <div role="status" className="flex items-start gap-2.5 rounded-control bg-ok-bg px-4 py-3 text-ok">
          <Icon icon={CheckCircleIcon} size={16} className="mt-0.5" />
          <div>
            <p className="text-body font-semibold">{t.confirmadoTitle}</p>
            <Text size="support" tone="soft" className="mt-0.5">
              {t.confirmado(enviado)}
            </Text>
          </div>
        </div>
        <ButtonLink to={paths.entrar} fullWidth>
          {t.voltar}
        </ButtonLink>
      </Stack>
    );
  }

  return (
    <form noValidate onSubmit={enviar}>
      <Stack gap="lg">
        <Field label={t.email} error={erro}>
          {(control) => (
            <Input
              {...control}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErro(undefined);
              }}
            />
          )}
        </Field>
        <Button variant="primary" type="submit" fullWidth>
          {t.enviar}
        </Button>
        <ButtonLink to={paths.entrar} variant="tertiary" fullWidth>
          {t.voltar}
        </ButtonLink>
      </Stack>
    </form>
  );
}

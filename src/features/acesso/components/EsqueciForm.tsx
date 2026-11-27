import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { authApi, codigoDoErro, lerProblema } from '@/shared/api';
import { cnpjValido, formatCnpj, paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AlertBox, Button, ButtonLink, Field, Icon, Input, Stack, Text } from '@/shared/ui';
import { mensagemDeErro } from '../erros';
import { validarNovaSenha } from '../senha';

const t = strings.pages.acesso.esqueci;
const ts = strings.pages.acesso.senha;
const te = strings.pages.acesso.entrar;

/** Intervalo mínimo da API entre envios de código para o mesmo CNPJ. */
const REENVIO_S = 60;

type Etapa = 'cnpj' | 'codigo' | 'senha' | 'concluido';
type Erros = Partial<Record<'cnpj' | 'codigo' | 'nova' | 'confirmacao', string>>;

/**
 * Recuperação de senha em três passos: CNPJ (forgot-password) → código do e-mail (validate-code)
 * → nova senha (reset-password). Nunca diz se o CNPJ existe (não vaza quem é cliente).
 */
export function EsqueciForm() {
  const [etapa, setEtapa] = useState<Etapa>('cnpj');
  const [cnpj, setCnpj] = useState('');
  const [codigo, setCodigo] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [nova, setNova] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [erroTopo, setErroTopo] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [reenvioEm, setReenvioEm] = useState(0);

  useEffect(() => {
    if (reenvioEm <= 0) return;
    const timer = window.setTimeout(() => setReenvioEm((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [reenvioEm]);

  function irPara(proxima: Etapa) {
    setEtapa(proxima);
    setErros({});
    setErroTopo(null);
    setAviso(null);
  }

  /** Roda a chamada com o botão em espera; o erro vai para o topo, salvo se `tratar` cuidar dele. */
  async function executar(chamada: () => Promise<void>, tratar?: (erro: unknown) => boolean) {
    setEnviando(true);
    setErroTopo(null);
    try {
      await chamada();
    } catch (erro) {
      if (!tratar?.(erro)) setErroTopo(mensagemDeErro(erro));
    } finally {
      setEnviando(false);
    }
  }

  function enviarCnpj(event: FormEvent) {
    event.preventDefault();
    if (!cnpjValido(cnpj)) {
      setErros({ cnpj: te.cnpjErro });
      return;
    }
    void executar(async () => {
      await authApi.solicitarCodigo(cnpj);
      setCodigo('');
      setReenvioEm(REENVIO_S);
      irPara('codigo');
    });
  }

  function reenviar() {
    void executar(async () => {
      await authApi.solicitarCodigo(cnpj);
      setReenvioEm(REENVIO_S);
      setAviso(t.reenviado);
    });
  }

  function enviarCodigo(event: FormEvent) {
    event.preventDefault();
    if (!/^\d{6}$/.test(codigo)) {
      setErros({ codigo: t.codigoErro });
      return;
    }
    setAviso(null);
    void executar(
      async () => {
        const { resetToken: token } = await authApi.validarCodigo(cnpj, codigo);
        setResetToken(token);
        irPara('senha');
      },
      (erro) => {
        if (codigoDoErro(erro) !== 'INVALID_CODE') return false;
        setErros({ codigo: t.codigoInvalido });
        return true;
      },
    );
  }

  function enviarSenha(event: FormEvent) {
    event.preventDefault();
    const novos = validarNovaSenha(nova, confirmacao);
    setErros(novos);
    if (Object.values(novos).some(Boolean)) return;
    void executar(
      async () => {
        await authApi.redefinirSenha(resetToken, nova, confirmacao);
        irPara('concluido');
      },
      (erro) => {
        switch (codigoDoErro(erro)) {
          case 'INVALID_RESET_TOKEN':
            setCodigo('');
            irPara('codigo');
            setErroTopo(t.tokenExpirado);
            return true;
          case 'WEAK_PASSWORD':
            setErros({ nova: lerProblema(erro)?.title ?? ts.regras });
            return true;
          case 'PASSWORD_CONFIRMATION_MISMATCH':
            setErros({ confirmacao: ts.confirmacaoErro });
            return true;
          case 'CREDENTIAL_NOT_FOUND':
            setErroTopo(t.semCredencial);
            return true;
          default:
            return false;
        }
      },
    );
  }

  const topo = erroTopo && (
    <AlertBox variant="error" withIcon>
      {erroTopo}
    </AlertBox>
  );

  if (etapa === 'concluido') {
    return (
      <Stack gap="lg">
        <div role="status" className="flex items-start gap-2.5 rounded-control bg-ok-bg px-4 py-3 text-ok">
          <Icon icon={CheckCircleIcon} size={16} className="mt-0.5" />
          <div>
            <p className="text-body font-semibold">{t.confirmadoTitle}</p>
            <Text size="support" tone="soft" className="mt-0.5">
              {t.confirmado}
            </Text>
          </div>
        </div>
        <ButtonLink to={paths.entrar} variant="primary" fullWidth>
          {t.voltar}
        </ButtonLink>
      </Stack>
    );
  }

  if (etapa === 'senha') {
    return (
      <form noValidate onSubmit={enviarSenha}>
        <Stack gap="lg">
          {topo}
          <Text size="support" tone="soft">
            {t.senhaTexto}
          </Text>
          <Field label={ts.novaSenha} hint={ts.regras} error={erros.nova}>
            {(control) => <Input {...control} type="password" autoComplete="new-password" value={nova} onChange={(e) => setNova(e.target.value)} />}
          </Field>
          <Field label={ts.confirmacao} error={erros.confirmacao}>
            {(control) => (
              <Input {...control} type="password" autoComplete="new-password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} />
            )}
          </Field>
          <Button variant="primary" type="submit" fullWidth disabled={enviando}>
            {enviando ? t.redefinindo : t.redefinir}
          </Button>
        </Stack>
      </form>
    );
  }

  if (etapa === 'codigo') {
    return (
      <form noValidate onSubmit={enviarCodigo}>
        <Stack gap="lg">
          {topo}
          {aviso && (
            <Text size="support" tone="soft" role="status">
              {aviso}
            </Text>
          )}
          <Text size="support" tone="soft">
            {t.codigoTexto(formatCnpj(cnpj))}
          </Text>
          <Field label={t.codigo} error={erros.codigo}>
            {(control) => (
              <Input
                {...control}
                mono
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setErros({});
                }}
              />
            )}
          </Field>
          <Button variant="primary" type="submit" fullWidth disabled={enviando}>
            {enviando ? t.validando : t.validar}
          </Button>
          <Button fullWidth onClick={reenviar} disabled={enviando || reenvioEm > 0}>
            {reenvioEm > 0 ? t.reenviarEm(reenvioEm) : t.reenviar}
          </Button>
          <Button variant="tertiary" fullWidth onClick={() => irPara('cnpj')}>
            {t.outroCnpj}
          </Button>
        </Stack>
      </form>
    );
  }

  return (
    <form noValidate onSubmit={enviarCnpj}>
      <Stack gap="lg">
        {topo}
        <Field label={t.cnpj} error={erros.cnpj}>
          {(control) => (
            <Input
              {...control}
              mono
              inputMode="numeric"
              autoComplete="username"
              placeholder={te.cnpjPlaceholder}
              value={formatCnpj(cnpj)}
              onChange={(e) => {
                setCnpj(e.target.value.replace(/\D/g, '').slice(0, 14));
                setErros({});
              }}
            />
          )}
        </Field>
        <Button variant="primary" type="submit" fullWidth disabled={enviando}>
          {enviando ? t.enviando : t.enviar}
        </Button>
        <ButtonLink to={paths.entrar} variant="tertiary" fullWidth>
          {t.voltar}
        </ButtonLink>
      </Stack>
    </form>
  );
}

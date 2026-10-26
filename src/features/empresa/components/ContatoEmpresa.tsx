import { useState, type FormEvent } from 'react';
import { KeyIcon } from '@heroicons/react/24/outline';
import type { Empresa } from '@/entities';
import { emailValido, formatPhone, telefoneValido } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { Block, Button, Field, InfoNote, Input, Modal, Stack, useToast } from '@/shared/ui';
import { useAcoesEmpresa } from '../hooks/useEmpresa';

const t = strings.pages.empresa.contato;
const tm = strings.pages.empresa.modalSenha;

type Erros = Partial<Record<'email' | 'responsavel' | 'telefone', string>>;
type ErrosSenha = Partial<Record<'atual' | 'nova' | 'confirmar', string>>;

/** Troca de senha: só a interface; nada sai do navegador nesta etapa. */
function ModalSenha({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { showToast } = useToast();
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erros, setErros] = useState<ErrosSenha>({});

  function fechar() {
    setAtual('');
    setNova('');
    setConfirmar('');
    setErros({});
    onClose();
  }

  function salvar(event: FormEvent) {
    event.preventDefault();
    const novos: ErrosSenha = {
      atual: atual ? undefined : tm.erroAtual,
      nova: nova.length >= 8 ? undefined : tm.erroNova,
      confirmar: confirmar === nova ? undefined : tm.erroConfirmar,
    };
    setErros(novos);
    if (Object.values(novos).some(Boolean)) return;
    showToast(tm.toast);
    fechar();
  }

  return (
    <Modal
      open={open}
      onClose={fechar}
      title={tm.title}
      description={tm.descricao}
      footer={
        <>
          <Button onClick={fechar}>{tm.cancelar}</Button>
          <Button variant="primary" type="submit" form="form-senha">
            {tm.salvar}
          </Button>
        </>
      }
    >
      <form id="form-senha" noValidate onSubmit={salvar}>
        <Stack>
          <Field label={tm.atual} error={erros.atual}>
            {(control) => <Input {...control} type="password" autoComplete="current-password" value={atual} onChange={(e) => setAtual(e.target.value)} />}
          </Field>
          <Field label={tm.nova} hint={tm.novaHint} error={erros.nova}>
            {(control) => <Input {...control} type="password" autoComplete="new-password" value={nova} onChange={(e) => setNova(e.target.value)} />}
          </Field>
          <Field label={tm.confirmar} error={erros.confirmar}>
            {(control) => <Input {...control} type="password" autoComplete="new-password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />}
          </Field>
        </Stack>
      </form>
    </Modal>
  );
}

/** Contato e acesso: o que a empresa pode mudar sozinha. */
export function ContatoEmpresa({ empresa }: { empresa: Empresa }) {
  const { salvarContato } = useAcoesEmpresa();
  const { showToast } = useToast();
  const [email, setEmail] = useState(empresa.emailNotificacoes);
  const [responsavel, setResponsavel] = useState(empresa.responsavel);
  const [telefone, setTelefone] = useState(empresa.telefone);
  const [erros, setErros] = useState<Erros>({});
  const [senhaAberta, setSenhaAberta] = useState(false);

  function salvar(event: FormEvent) {
    event.preventDefault();
    const novos: Erros = {
      email: emailValido(email) ? undefined : t.emailErro,
      responsavel: responsavel.trim() ? undefined : t.responsavelErro,
      telefone: telefoneValido(telefone) ? undefined : t.telefoneErro,
    };
    setErros(novos);
    if (Object.values(novos).some(Boolean)) return;
    showToast(salvarContato({ emailNotificacoes: email, responsavel, telefone }) ? t.toast : t.semMudanca);
  }

  return (
    <Block title={t.title} padded>
      <form noValidate onSubmit={salvar}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t.email} error={erros.email} className="sm:col-span-2">
            {(control) => <Input {...control} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
          </Field>
          <Field label={t.responsavel} error={erros.responsavel}>
            {(control) => <Input {...control} value={responsavel} onChange={(e) => setResponsavel(e.target.value)} />}
          </Field>
          <Field label={t.telefone} error={erros.telefone}>
            {(control) => (
              <Input {...control} inputMode="tel" value={formatPhone(telefone)} onChange={(e) => setTelefone(e.target.value.replace(/\D/g, '').slice(0, 11))} />
            )}
          </Field>
        </div>
        <InfoNote
          className="mt-4"
          title={t.senha.title}
          action={
            <Button size="sm" icon={KeyIcon} onClick={() => setSenhaAberta(true)}>
              {t.senha.alterar}
            </Button>
          }
        >
          {t.senha.texto}
        </InfoNote>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" type="submit">
            {t.salvar}
          </Button>
        </div>
      </form>
      <ModalSenha open={senhaAberta} onClose={() => setSenhaAberta(false)} />
    </Block>
  );
}

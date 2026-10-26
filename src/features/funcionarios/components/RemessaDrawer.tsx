import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CheckCircleIcon, PaperClipIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { itensDeFuncionario, nomeDoTipo } from '@/entities';
import { datasetStore, exemplos } from '@/mocks';
import { cn, cpfValido, formatCpf, formatPhone, telefoneValido, useStore, validarArquivo, type ArquivoEscolhido } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AlertBox, Button, Drawer, Field, Heading, Icon, IconButton, InfoNote, Input, Modal, Select, Stack, Tag, Text, useToast } from '@/shared/ui';
import { useAcoesRemessa } from '../hooks/useAcoesRemessa';
import type { PessoaRemessa } from '../types';

const t = strings.pages.remessa;
const LIMITE = 10;

type Form = Omit<PessoaRemessa, 'chave'>;
type Erros = Partial<Record<'cpf' | 'telefone' | 'nome' | 'funcao', string>>;

const FORM_VAZIO: Form = { cpf: '', telefone: '', nome: '', funcao: '', arquivos: {} };

/** Um documento da pessoa: anexar ou trocar. Arquivo fora do formato aparece com o motivo, na hora. */
function Anexo({
  tipoDocumentoId,
  nome,
  obrigatorio,
  arquivo,
  onAnexar,
}: {
  tipoDocumentoId: string;
  nome: string;
  obrigatorio: boolean;
  arquivo: ArquivoEscolhido | undefined;
  onAnexar: (tipo: string, arquivo: ArquivoEscolhido) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState<string | null>(null);
  const acao = arquivo ? t.trocar : t.anexar;
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-4 py-3 last:border-b-0">
      <Icon icon={arquivo ? CheckCircleIcon : PaperClipIcon} size={16} className={cn('flex-none', arquivo ? 'text-ok' : 'text-ink-4')} />
      <div className="min-w-0 flex-1 basis-40">
        <p className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-body">{nome}</span>
          <Tag kind={obrigatorio ? 'obrigatorio' : 'opcional'} />
        </p>
        {arquivo && (
          <Text size="label" tone="muted" className="mt-0.5 truncate">
            {arquivo.nome}
          </Text>
        )}
        {erro && (
          <Text size="label" role="alert" className="mt-0.5 text-danger">
            {erro}
          </Text>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          const escolhido = { nome: file.name, tamanhoKb: Math.max(1, Math.round(file.size / 1000)) };
          const problema = validarArquivo(escolhido);
          setErro(problema === 'formato' ? strings.pages.envio.erroFormato : problema === 'tamanho' ? strings.pages.envio.erroTamanho : null);
          if (!problema) onAnexar(tipoDocumentoId, escolhido);
        }}
      />
      <Button size="sm" variant={arquivo ? 'tertiary' : 'secondary'} aria-label={t.anexarDescricao(acao, nome)} onClick={() => inputRef.current?.click()}>
        {acao}
      </Button>
    </li>
  );
}

type Props = {
  open: boolean;
  obraInicial: string | null;
  /** Revisão (/_estados): já com duas pessoas e a terceira preenchida. */
  exemplo?: boolean;
  onClose: () => void;
};

/**
 * Adicionar funcionários: até 10 pessoas por remessa, cada uma com os documentos dela.
 * A remessa vai inteira de uma vez para análise.
 */
export function RemessaDrawer({ open, obraInicial, exemplo = false, onClose }: Props) {
  const ds = useStore(datasetStore);
  const { enviarRemessa } = useAcoesRemessa();
  const { showToast } = useToast();
  const documentos = itensDeFuncionario(ds).map(({ item }) => ({
    tipoDocumentoId: item.tipoDocumentoId,
    nome: nomeDoTipo(ds, item.tipoDocumentoId),
    obrigatorio: item.obrigatoriedade === 'obrigatorio',
  }));
  const obrasOpcoes = ds.obras.map((o) => ({ value: o.id, label: o.nome }));

  const [obraId, setObraId] = useState(obraInicial ?? ds.obras[0]?.id ?? '');
  const [pessoas, setPessoas] = useState<PessoaRemessa[]>([]);
  const [form, setForm] = useState<Form>(FORM_VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState(false);

  // Cada abertura começa do zero (ou do exemplo).
  useEffect(() => {
    if (!open) return;
    setObraId(obraInicial ?? ds.obras[0]?.id ?? '');
    const comArquivos = (p: Omit<Form, 'arquivos'>, i: number): PessoaRemessa => ({
      ...p,
      chave: `ex-${i}`,
      arquivos: Object.fromEntries(
        documentos.slice(0, 4).map((d) => [d.tipoDocumentoId, { nome: `${d.tipoDocumentoId}-${p.nome.toLowerCase().replace(/\s+/g, '-')}.pdf`, tamanhoKb: 800 }]),
      ),
    });
    setPessoas(exemplo ? exemplos.remessa.adicionados.map(comArquivos) : []);
    setForm(exemplo ? { ...exemplos.remessa.emEdicao, arquivos: comArquivos(exemplos.remessa.emEdicao, 9).arquivos } : FORM_VAZIO);
    setErros({});
    setErroEnvio(null);
    // Só ao abrir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, exemplo]);

  const cheia = pessoas.length >= LIMITE;
  const arquivosTotal = pessoas.reduce((n, p) => n + Object.keys(p.arquivos).length, 0);

  function mudar(parcial: Partial<Form>) {
    setForm((atual) => ({ ...atual, ...parcial }));
    setErros((atual) => Object.fromEntries(Object.entries(atual).filter(([campo]) => !(campo in parcial))));
  }

  function adicionar(event: FormEvent) {
    event.preventDefault();
    const cpfs = new Set([...ds.funcionarios.map((f) => f.cpf), ...pessoas.map((p) => p.cpf)]);
    const novos: Erros = {
      cpf: !cpfValido(form.cpf) ? t.cpfErro : cpfs.has(form.cpf) ? t.cpfDuplicado : undefined,
      telefone: form.telefone && !telefoneValido(form.telefone) ? t.telefoneErro : undefined,
      nome: form.nome.trim().split(/\s+/).length >= 2 ? undefined : t.nomeErro,
      funcao: form.funcao ? undefined : t.funcaoErro,
    };
    setErros(novos);
    if (Object.values(novos).some(Boolean)) return;
    setPessoas((atual) => [...atual, { ...form, nome: form.nome.trim(), chave: `${form.cpf}-${atual.length}` }]);
    setForm(FORM_VAZIO);
    setErroEnvio(null);
  }

  function pedirEnvio() {
    if (pessoas.length === 0) {
      setErroEnvio(t.erroVazia);
      return;
    }
    setConfirmando(true);
  }

  function confirmar() {
    enviarRemessa(obraId, pessoas);
    setConfirmando(false);
    showToast(t.toast(pessoas.length));
    onClose();
  }

  const visiveis = pessoas.length > 4 ? pessoas.slice(0, 3) : pessoas;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t.title}
      subtitle={t.subtitle}
      footer={
        <>
          <Button variant="tertiary" onClick={onClose}>
            {t.cancelar}
          </Button>
          <Button variant="primary" onClick={pedirEnvio}>
            {pessoas.length === 0 ? t.enviarVazio : t.enviarN(pessoas.length)}
          </Button>
        </>
      }
    >
      <Stack gap="lg">
        {erroEnvio && (
          <AlertBox variant="error" withIcon>
            {erroEnvio}
          </AlertBox>
        )}
        <Field label={t.obra}>{(control) => <Select {...control} options={obrasOpcoes} value={obraId} onChange={(e) => setObraId(e.target.value)} />}</Field>

        <section aria-labelledby="remessa-lista">
          <div className="mb-2 flex items-center justify-between gap-3">
            <Heading level={3}>
              <span id="remessa-lista">{t.nestaRemessa}</span>
            </Heading>
            <Text size="support" tone="muted" className={cn(cheia && 'text-warn')}>
              {t.contador(pessoas.length)}
            </Text>
          </div>
          {pessoas.length === 0 ? (
            <p className="rounded-control border border-border px-4 py-4 text-center text-support text-ink-3">{t.nenhum}</p>
          ) : (
            <ul className="rounded-control border border-border">
              {visiveis.map((p) => (
                <li key={p.chave} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
                  <Icon icon={CheckCircleIcon} size={16} className="flex-none text-ok" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body">{p.nome}</p>
                    <Text size="label" tone="muted" className="mt-0.5 truncate">
                      {t.linhaMeta(formatCpf(p.cpf), p.funcao, Object.keys(p.arquivos).length)}
                    </Text>
                  </div>
                  <IconButton
                    icon={TrashIcon}
                    label={t.remover(p.nome)}
                    variant="ghost"
                    size="sm"
                    onClick={() => setPessoas((atual) => atual.filter((x) => x.chave !== p.chave))}
                  />
                </li>
              ))}
              {visiveis.length < pessoas.length && (
                <li className="px-4 py-3 text-label text-ink-3">{t.maisN(pessoas.length - visiveis.length)}</li>
              )}
            </ul>
          )}
        </section>

        {cheia ? (
          <AlertBox variant="warning" withIcon>
            <strong className="font-semibold">{t.limite}</strong> {t.limiteTexto}
          </AlertBox>
        ) : (
          <form noValidate onSubmit={adicionar} aria-labelledby="remessa-pessoa" className="border-t border-border pt-4">
            <Heading level={3}>
              <span id="remessa-pessoa">{t.funcionarioN(pessoas.length + 1)}</span>
            </Heading>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label={t.cpf} error={erros.cpf}>
                {(control) => (
                  <Input
                    {...control}
                    inputMode="numeric"
                    placeholder={t.cpfPlaceholder}
                    value={formatCpf(form.cpf)}
                    onChange={(e) => mudar({ cpf: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                  />
                )}
              </Field>
              <Field label={t.telefone} error={erros.telefone}>
                {(control) => (
                  <Input
                    {...control}
                    inputMode="tel"
                    placeholder={t.telefonePlaceholder}
                    value={formatPhone(form.telefone)}
                    onChange={(e) => mudar({ telefone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                  />
                )}
              </Field>
              <Field label={t.nome} error={erros.nome} className="sm:col-span-2">
                {(control) => <Input {...control} placeholder={t.nomePlaceholder} value={form.nome} onChange={(e) => mudar({ nome: e.target.value })} />}
              </Field>
              <Field label={t.funcao} error={erros.funcao} className="sm:col-span-2">
                {(control) => (
                  <Select
                    {...control}
                    options={[{ value: '', label: t.funcaoPlaceholder }, ...t.funcoes.map((f) => ({ value: f, label: f }))]}
                    value={form.funcao}
                    onChange={(e) => mudar({ funcao: e.target.value })}
                  />
                )}
              </Field>
            </div>
            <p className="mt-4 mb-1.5 text-label font-medium text-ink-2">{t.documentos}</p>
            <ul className="rounded-control border border-border">
              {documentos.map((d) => (
                <Anexo
                  key={d.tipoDocumentoId}
                  {...d}
                  arquivo={form.arquivos[d.tipoDocumentoId]}
                  onAnexar={(tipo, arquivo) => mudar({ arquivos: { ...form.arquivos, [tipo]: arquivo } })}
                />
              ))}
            </ul>
            <Text size="label" tone="muted" className="mt-1.5">
              {t.documentosNota}
            </Text>
            <Button type="submit" icon={PlusIcon} fullWidth className="mt-3">
              {t.adicionarARemessa}
            </Button>
          </form>
        )}

        <InfoNote title={t.envioUnico.title}>{t.envioUnico.texto}</InfoNote>
      </Stack>

      <Modal
        open={confirmando}
        onClose={() => setConfirmando(false)}
        title={t.confirmar.title(pessoas.length)}
        description={t.confirmar.texto(pessoas.length, arquivosTotal)}
        footer={
          <>
            <Button onClick={() => setConfirmando(false)}>{t.confirmar.voltar}</Button>
            <Button variant="primary" onClick={confirmar}>
              {t.confirmar.confirmar}
            </Button>
          </>
        }
      >
        <AlertBox variant="warning" withIcon>
          {t.confirmar.aviso}
        </AlertBox>
      </Modal>
    </Drawer>
  );
}

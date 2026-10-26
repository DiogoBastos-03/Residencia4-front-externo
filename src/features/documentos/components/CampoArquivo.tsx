import { useEffect, useId, useRef, useState, type DragEvent } from 'react';
import { ArrowUpTrayIcon, CheckCircleIcon, PaperClipIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { cn, validarArquivo, type ArquivoEscolhido } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { Button, Icon, IconButton, Text } from '@/shared/ui';

const t = strings.pages.envio;
const ACCEPT = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png';

type Props = {
  value: ArquivoEscolhido | null;
  onChange: (arquivo: ArquivoEscolhido | null) => void;
  /** Erro vindo da validação do formulário (ex.: nenhum arquivo escolhido). */
  erro?: string;
};

function doArquivo(file: File): ArquivoEscolhido {
  return { nome: file.name, tamanhoKb: Math.max(1, Math.round(file.size / 1000)) };
}

/**
 * Área de envio: arrastar ou escolher. Mostra na hora se o formato ou o tamanho não servem.
 * O botão "Escolher arquivo" é o alvo de teclado; o input de arquivo fica escondido.
 */
export function CampoArquivo({ value, onChange, erro }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);
  const caixaRef = useRef<HTMLDivElement>(null);
  const temArquivo = value !== null;
  const anterior = useRef(temArquivo);

  // A área troca de forma ao escolher ou remover: o foco segue para o novo controle,
  // em vez de cair no início da página.
  useEffect(() => {
    if (anterior.current === temArquivo) return;
    anterior.current = temArquivo;
    caixaRef.current?.querySelector<HTMLElement>('button')?.focus();
  }, [temArquivo]);
  const id = useId();
  const statusId = `${id}-status`;
  const problema = value ? validarArquivo(value) : null;
  const mensagemProblema = problema === 'formato' ? t.erroFormato : problema === 'tamanho' ? t.erroTamanho : undefined;

  function escolher(file: File | undefined) {
    if (file) onChange(doArquivo(file));
  }

  function soltar(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setArrastando(false);
    escolher(event.dataTransfer.files[0]);
  }

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT}
      tabIndex={-1}
      aria-hidden="true"
      className="sr-only"
      onChange={(e) => {
        escolher(e.target.files?.[0]);
        e.target.value = '';
      }}
    />
  );

  return (
    <div>
      <p id={`${id}-label`} className="mb-1.5 text-label font-medium text-ink-2">
        {t.arquivo}
      </p>
      {input}
      <div ref={caixaRef}>
      {value ? (
        <div
          className={cn(
            'flex items-center gap-3 rounded-control border px-4 py-3',
            problema ? 'border-danger bg-danger-bg' : 'border-ok bg-ok-bg',
          )}
        >
          <Icon icon={problema ? XCircleIcon : CheckCircleIcon} size={18} className={problema ? 'text-danger' : 'text-ok'} />
          <div className="min-w-0 flex-1" id={statusId} role={problema ? 'alert' : 'status'}>
            <p className={cn('truncate text-body', problema ? 'text-danger' : 'text-ink')}>{value.nome}</p>
            <p className={cn('text-label', problema ? 'text-danger' : 'text-ink-3')}>
              {mensagemProblema ?? t.pronto(strings.dominio.tamanho(value.tamanhoKb))}
            </p>
          </div>
          <IconButton icon={TrashIcon} label={t.remover(value.nome)} variant="ghost" size="sm" onClick={() => onChange(null)} className={problema ? 'text-danger' : undefined} />
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setArrastando(true);
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={soltar}
          className={cn(
            'interactive-color flex flex-col items-center rounded-control border border-dashed px-4 py-6 text-center',
            arrastando ? 'border-action bg-action-soft' : erro ? 'border-danger bg-surface-2' : 'border-border-strong bg-surface-2',
          )}
        >
          <Icon icon={ArrowUpTrayIcon} size={20} className="text-ink-3" />
          <Text className="mt-2">{t.arraste}</Text>
          <Text size="label" tone="muted" className="mt-1">
            {t.formatos}
          </Text>
          <Button
            className="mt-3"
            icon={PaperClipIcon}
            aria-describedby={erro ? `${id}-erro` : `${id}-label`}
            onClick={() => inputRef.current?.click()}
          >
            {t.escolher}
          </Button>
        </div>
      )}
      </div>
      {erro && !value && (
        <p id={`${id}-erro`} role="alert" className="mt-1.5 text-label text-danger">
          {erro}
        </p>
      )}
    </div>
  );
}

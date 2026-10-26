import type { ReactNode } from 'react';
import { BrandMark } from './BrandMark';

/** Telas de acesso: cartão centralizado sobre o fundo da aplicação, com a marca no topo. */
export function AcessoLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-app px-4 py-10">
      <div className="w-full max-w-modal rounded-card border border-border bg-surface p-6 max-sm:p-5">
        <BrandMark />
        <h1 className="mt-6 text-subpage font-semibold">{title}</h1>
        <p className="mt-1.5 text-body text-ink-3">{subtitle}</p>
        <div className="mt-5">{children}</div>
      </div>
    </main>
  );
}

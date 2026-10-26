import { AcessoLayout } from '@/app/layout/AcessoLayout';
import { EsqueciForm } from '@/features/acesso';
import { useDocumentTitle } from '@/shared/lib';
import { strings } from '@/shared/strings';

const t = strings.pages.acesso.esqueci;

export function EsqueciSenhaPage() {
  useDocumentTitle(t.documentTitle);
  return (
    <AcessoLayout title={t.title} subtitle={t.subtitle}>
      <EsqueciForm />
    </AcessoLayout>
  );
}

import { AcessoLayout } from '@/app/layout/AcessoLayout';
import { EntrarForm } from '@/features/acesso';
import { useDocumentTitle } from '@/shared/lib';
import { strings } from '@/shared/strings';

const t = strings.pages.acesso.entrar;

export function EntrarPage() {
  useDocumentTitle(t.documentTitle);
  return (
    <AcessoLayout title={t.title} subtitle={t.subtitle}>
      <EntrarForm />
    </AcessoLayout>
  );
}

import { CadastroEmpresa, ContatoEmpresa, useEmpresa } from '@/features/empresa';
import { useDocumentTitle } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AsyncContent, Grid, PageHeader, SkeletonBlock, Stack } from '@/shared/ui';

const t = strings.pages.empresa;

export function EmpresaPage() {
  useDocumentTitle(t.title);
  const query = useEmpresa();
  return (
    <Stack>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <AsyncContent
        query={query}
        skeleton={
          <Grid>
            <SkeletonBlock rows={5} />
            <SkeletonBlock rows={4} />
          </Grid>
        }
      >
        {(empresa) => (
          <Grid className="items-start">
            <CadastroEmpresa empresa={empresa} />
            <ContatoEmpresa empresa={empresa} />
          </Grid>
        )}
      </AsyncContent>
    </Stack>
  );
}

import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { ObrasLista, useObras } from '@/features/obras';
import { useDocumentTitle } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { AsyncContent, EmptyState, PageHeader, SkeletonBlock, Stack } from '@/shared/ui';

const t = strings.pages.obras;

export function ObrasPage() {
  useDocumentTitle(t.title);
  const query = useObras();
  return (
    <Stack>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <AsyncContent
        query={query}
        skeleton={<SkeletonBlock rows={3} />}
        isEmpty={(obras) => obras.length === 0}
        empty={<EmptyState icon={BuildingOffice2Icon} title={t.vazioTitle} description={t.vazioDescription} />}
      >
        {(obras) => <ObrasLista obras={obras} />}
      </AsyncContent>
    </Stack>
  );
}

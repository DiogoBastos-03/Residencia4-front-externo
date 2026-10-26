import { ClockIcon, DocumentDuplicateIcon, BuildingOffice2Icon, Squares2X2Icon, UserGroupIcon } from '@heroicons/react/24/outline';
import { paths } from '@/shared/lib';
import { strings } from '@/shared/strings';
import type { HeroIcon } from '@/shared/ui';

export type NavItem = {
  to: string;
  label: string;
  icon: HeroIcon;
  /** Só fica ativo na rota exata. */
  end?: boolean;
  /** Mostra o contador de documentos pendentes. */
  contador?: boolean;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { to: paths.inicio, label: strings.layout.nav.inicio, icon: Squares2X2Icon, end: true },
  { to: paths.documentos, label: strings.layout.nav.documentos, icon: DocumentDuplicateIcon, contador: true },
  { to: paths.obras, label: strings.layout.nav.obras, icon: BuildingOffice2Icon },
  { to: paths.funcionarios, label: strings.layout.nav.funcionarios, icon: UserGroupIcon },
  { to: paths.historico, label: strings.layout.nav.historico, icon: ClockIcon },
];

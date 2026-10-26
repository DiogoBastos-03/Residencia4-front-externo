import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router';
import { datasetStore } from '@/mocks';
import { cn, formatCnpj, paths, useStore } from '@/shared/lib';
import { strings } from '@/shared/strings';
import { IconButton } from '@/shared/ui';
import { BrandMark } from './BrandMark';
import { SidebarNav } from './SidebarNav';

type SidebarProps = {
  pendencias: number | undefined;
  onSair: () => void;
  className?: string;
  onNavigate?: () => void;
};

function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

/** Marca, navegação e, no rodapé, a empresa logada (abre os dados da empresa) e o botão de sair. */
export function Sidebar({ pendencias, onSair, className, onNavigate }: SidebarProps) {
  const empresa = useStore(datasetStore).empresa;
  return (
    <div className={cn('flex w-sidebar flex-none flex-col rounded-card border border-border bg-surface p-2', className)}>
      <div className="px-1.5 pt-2 pb-3">
        <BrandMark />
      </div>
      <SidebarNav pendencias={pendencias} onNavigate={onNavigate} />
      <div className="mt-auto flex items-center gap-1 border-t border-border pt-2">
        <NavLink
          to={paths.empresa}
          onClick={onNavigate}
          aria-label={strings.layout.empresaLink(empresa.nome)}
          className={({ isActive }) =>
            cn(
              'focus-ring interactive-color flex min-w-0 flex-1 items-center gap-2.5 rounded-control px-1.5 py-1.5',
              isActive ? 'bg-primary-soft text-primary-hover' : 'text-ink hover:bg-surface-2',
            )
          }
        >
          <span aria-hidden="true" className="flex size-7 flex-none items-center justify-center rounded-control bg-surface-3 text-label font-semibold text-ink-2">
            {iniciais(empresa.nome)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-support font-medium">{empresa.nome}</span>
            <span className="block font-mono text-label text-ink-4">{formatCnpj(empresa.cnpj)}</span>
          </span>
        </NavLink>
        <IconButton icon={ArrowRightStartOnRectangleIcon} label={strings.layout.sair} variant="ghost" size="sm" onClick={onSair} />
      </div>
    </div>
  );
}

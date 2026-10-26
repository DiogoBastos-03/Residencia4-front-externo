import { useCallback, useState } from 'react';
import { Outlet } from 'react-router';
import { ModalSair } from '@/features/acesso';
import { useContadorPendencias } from '@/features/documentos';
import { strings } from '@/shared/strings';
import { MobileSidebar } from './MobileSidebar';
import { MobileTopBar } from './MobileTopBar';
import { Sidebar } from './Sidebar';

/**
 * Sidebar + área de conteúdo, como no painel interno. Acima de 1024px a sidebar é fixa
 * e o conteúdo rola dentro do cartão; até 1024px a sidebar vira menu e a página rola normalmente.
 */
export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sairAberto, setSairAberto] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const abrirSair = useCallback(() => {
    setMenuOpen(false);
    setSairAberto(true);
  }, []);
  const { data: pendencias } = useContadorPendencias();

  return (
    <div className="flex min-h-dvh gap-2 bg-app p-3 nav:h-dvh max-sm:p-2">
      <a
        href="#conteudo"
        className="focus-ring sr-only z-50 rounded-control bg-surface px-4 py-2 text-support font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {strings.layout.skipToContent}
      </a>
      <Sidebar pendencias={pendencias} onSair={abrirSair} className="hidden nav:flex" />
      <MobileSidebar open={menuOpen} onClose={closeMenu} pendencias={pendencias} onSair={abrirSair} />
      <main
        id="conteudo"
        tabIndex={-1}
        className="relative min-w-0 flex-1 rounded-card border border-border bg-surface p-5 outline-none nav:overflow-y-auto max-sm:p-4"
      >
        <MobileTopBar onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
        <Outlet />
      </main>
      <ModalSair open={sairAberto} onClose={() => setSairAberto(false)} />
    </div>
  );
}

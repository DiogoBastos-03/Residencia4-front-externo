import { useEffect, useRef } from 'react';

/** Camadas abertas (painel, modal sobre o painel…), da mais antiga para a mais nova. */
const pilha: Array<{ current: () => void }> = [];

function aoTeclar(event: KeyboardEvent) {
  if (event.key !== 'Escape') return;
  const topo = pilha[pilha.length - 1];
  if (!topo) return;
  event.stopPropagation();
  topo.current();
}

/**
 * Chama `onEscape` quando Esc é pressionado, enquanto `active`.
 * Com camadas empilhadas (modal sobre painel), só a de cima fecha.
 */
export function useEscapeKey(active: boolean, onEscape: () => void): void {
  const ref = useRef(onEscape);
  useEffect(() => {
    ref.current = onEscape;
  });

  useEffect(() => {
    if (!active) return;
    const entrada = { current: () => ref.current() };
    pilha.push(entrada);
    if (pilha.length === 1) document.addEventListener('keydown', aoTeclar);
    return () => {
      const i = pilha.indexOf(entrada);
      if (i >= 0) pilha.splice(i, 1);
      if (pilha.length === 0) document.removeEventListener('keydown', aoTeclar);
    };
  }, [active]);
}

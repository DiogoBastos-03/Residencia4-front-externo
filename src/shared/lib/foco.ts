const ESPERA_MAX_MS = 1500;
const INTERVALO_MS = 50;

/**
 * Depois que um painel fecha, devolve o foco ao primeiro elemento visível que casar com o
 * seletor — ex.: o link da linha que abriu o painel. Espera o painel sair da tela (a animação
 * de saída) e só age se o foco tiver ficado solto no body: quem abriu pelo teclado já tem o
 * foco devolvido pelo próprio painel.
 */
export function focarDepois(seletor: string): void {
  const inicio = Date.now();
  const tentar = () => {
    const painelAberto = document.querySelector('[role="dialog"]') !== null;
    if (painelAberto && Date.now() - inicio < ESPERA_MAX_MS) {
      window.setTimeout(tentar, INTERVALO_MS);
      return;
    }
    if (document.activeElement && document.activeElement !== document.body) return;
    // A tabela tem duas versões (desktop e cartões); foca a que está visível.
    const alvo = Array.from(document.querySelectorAll<HTMLElement>(seletor)).find((el) => el.offsetParent !== null);
    alvo?.focus();
  };
  window.setTimeout(tentar, INTERVALO_MS);
}

/** Textos do layout: sidebar, navegação e barra móvel. */
export const layout = {
  skipToContent: 'Pular para o conteúdo',
  navLabel: 'Navegação principal',
  nav: {
    inicio: 'Início',
    documentos: 'Documentos',
    obras: 'Obras',
    funcionarios: 'Funcionários',
    historico: 'Histórico',
  },
  pendencias: (n: number) => (n === 1 ? '1 documento pendente' : `${n} documentos pendentes`),
  empresaLink: (nome: string) => `Dados da empresa — ${nome}`,
  sair: 'Sair do portal',
  openMenu: 'Abrir menu',
  closeMenu: 'Fechar menu',
  menuDialog: 'Menu',
  modalSair: {
    title: 'Sair do portal?',
    texto: 'Você vai precisar entrar de novo com o CNPJ e a senha da empresa.',
    cancelar: 'Cancelar',
    confirmar: 'Sair',
  },
} as const;

/**
 * Conteúdo de exemplo que preenche formulários de revisão (o envio da FGTS e a remessa,
 * como nas telas do protótipo). Só é usado quando a URL pede ?exemplo=1, pela /_estados.
 */
export const exemplos = {
  envio: {
    arquivo: { nome: 'certidao-fgts-2026.pdf', tamanhoKb: 2400 },
    arquivoInvalido: { nome: 'planilha-certidoes.xlsx', tamanhoKb: 86 },
    validade: '10/03/2027',
    observacao: 'Certidão emitida hoje no portal da Caixa.',
  },
  /** Remessa em andamento: duas pessoas já adicionadas e a terceira sendo preenchida. */
  remessa: {
    adicionados: [
      { cpf: '52998224725', telefone: '81991112233', nome: 'Josias Carvalho', funcao: 'Pedreiro' },
      { cpf: '11144477735', telefone: '81992223344', nome: 'Renato Guedes', funcao: 'Servente' },
    ],
    emEdicao: { cpf: '39053344705', telefone: '81996543456', nome: 'Thiago Arruda', funcao: 'Pedreiro' },
  },
} as const;

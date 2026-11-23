import { dominio } from '../dominio';

/** Início (/). */
export const inicioPage = {
  title: 'Início',
  subtitle: (dataLonga: string) => `${dataLonga} — o que a JotaNunes precisa de você.`,
  metricas: {
    emDia: 'Em dia',
    emDiaHint: (total: number) => `de ${total} documentos obrigatórios`,
    emAnalise: 'Em análise',
    emAnaliseHint: 'com a equipe da JotaNunes',
    exigenciasNaoAtendidas: 'Exigências não atendidas',
    vencidos: 'Vencidos',
    vencidosHint: 'precisa renovar',
  },
  atencao: {
    title: 'Precisa da sua atenção',
    contagem: (n: number) => dominio.itens(n),
    venceu: (data: string) => `Venceu em ${data}`,
    naoEnviado: (desde: string) => `Ainda não enviado ${dominio.separador.trim()} exigido desde ${desde}`,
    reprovado: (motivo: string) => `Reprovado: ${motivo}`,
    vazioTitle: 'Nada pendente',
    vazioDescription: 'Todos os documentos obrigatórios estão enviados e em dia. Quando algo vencer ou for reprovado, aparece aqui.',
  },
  obras: {
    title: 'Suas obras',
    verTodas: 'Ver todas',
    linha: (servico: string, funcionarios: number) => `${servico}${dominio.separador}${funcionarios === 1 ? '1 funcionário alocado' : `${funcionarios} funcionários alocados`}`,
    semPendencia: 'Em dia',
    vazio: 'Nenhuma obra vinculada ainda.',
  },
  vencimentos: {
    title: 'Vencimentos próximos',
    total: (n: number) => `${n} ${n === 1 ? 'documento' : 'documentos'} nos próximos 30 dias`,
  },
  atualizacoes: {
    title: 'Últimas atualizações',
    verHistorico: 'Ver histórico',
    vazio: 'Nada aconteceu ainda com a documentação da empresa.',
  },
} as const;

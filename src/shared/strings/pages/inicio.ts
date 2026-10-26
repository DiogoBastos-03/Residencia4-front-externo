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
    pendentes: 'Pendentes',
    pendentesHint: 'ainda não enviado',
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
    emDias: (dias: number) => (dias === 0 ? 'Vence hoje' : dias === 1 ? 'Vence amanhã' : `Vence em ${dias} dias`),
    emMes: (mesAno: string) => `Vence em ${mesAno}`,
    vazio: 'Nenhum documento com validade por vencer.',
  },
  atualizacoes: {
    title: 'Últimas atualizações',
    verHistorico: 'Ver histórico',
    vazio: 'Nada aconteceu ainda com a documentação da empresa.',
  },
} as const;

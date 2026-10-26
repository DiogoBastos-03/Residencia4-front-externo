/** Histórico (/historico). */
export const historicoPage = {
  title: 'Histórico',
  subtitle: 'Tudo que aconteceu com a documentação da sua empresa.',
  filtrosLabel: 'Filtrar por tipo de evento',
  filtros: { tudo: 'Tudo', envio: 'Envios', decisao: 'Decisões', exigencia: 'Exigências' },
  periodoLabel: 'Período',
  periodos: [
    { value: '30', label: 'Últimos 30 dias' },
    { value: '90', label: 'Últimos 90 dias' },
    { value: '365', label: 'Últimos 12 meses' },
  ],
  caption: 'Eventos da documentação',
  colunas: { data: 'Data', hora: 'Hora', evento: 'Evento', item: 'Item', por: 'Por' },
  acoes: {
    documentoEnviado: 'Documento enviado',
    remessaEnviada: 'Remessa enviada',
    documentoAprovado: 'Documento aprovado',
    documentoReprovado: 'Documento reprovado',
    novaExigencia: 'Nova exigência',
    obraVinculada: 'Obra vinculada',
  },
  vazioTitle: 'Nada neste período',
  vazioDescription: 'Escolha um período maior ou outro tipo de evento.',
} as const;

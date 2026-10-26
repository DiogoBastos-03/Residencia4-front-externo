import { dominio } from '../dominio';

/** Documentos (/documentos) e o painel do documento (/documentos/:id). */
export const documentosPage = {
  title: 'Documentos',
  subtitle: 'O que a JotaNunes exige da sua empresa hoje.',
  filtrosLabel: 'Filtrar documentos por situação',
  filtros: { todos: 'Todos', pendentes: 'Pendentes', analise: 'Análise', aprovados: 'Aprovados' },
  buscaLabel: 'Buscar documento',
  buscaPlaceholder: 'Buscar documento',
  caption: (lista: string) => `Documentos de ${lista}`,
  colunas: { documento: 'Documento', tipo: 'Tipo', situacao: 'Situação', validade: 'Validade', ultimoEnvio: 'Último envio' },
  acaoDescricao: (nome: string) => nome,
  funcionarios: {
    titulo: 'Funcionários em campo',
    resumo: (c: { total: number; emDia: number; emAnalise: number; pendente: number; reprovado: number }) =>
      [
        `${c.total} cadastrados`,
        `${c.emDia} em dia`,
        c.emAnalise > 0 ? `${c.emAnalise} em análise` : '',
        c.pendente > 0 ? `${c.pendente} ${c.pendente === 1 ? 'pendente' : 'pendentes'}` : '',
        c.reprovado > 0 ? `${c.reprovado} ${c.reprovado === 1 ? 'reprovado' : 'reprovados'}` : '',
      ]
        .filter(Boolean)
        .join(dominio.separador),
    nenhum: 'Ninguém cadastrado ainda',
    ver: 'Ver funcionários',
    adicionar: 'Adicionar',
  },
  comoFunciona: {
    title: 'Como funciona',
    texto:
      'Um documento da empresa é enviado uma vez e vale para todas as obras que o exigem. Se você não enviar, ele continua pendente e aparece para a equipe da JotaNunes — nada é bloqueado automaticamente.',
  },
  semResultadoTitle: 'Nenhum documento com este filtro',
  semResultadoDescription: 'Troque o filtro ou apague a busca para ver todos os documentos exigidos.',
  limparFiltros: 'Ver todos',
  vazioTitle: 'Nenhum documento exigido ainda',
  vazioDescription: 'Os documentos aparecem quando a JotaNunes vincula sua empresa a uma obra com lista de exigências do seu tipo.',
  painel: {
    exigidoEm: 'Exigido em',
    suasObras: (n: number) => `Suas ${n} obras`,
    validade: 'Validade',
    enviadoEm: 'Enviado em',
    analisadoPor: 'Analisado por',
    decididoEm: 'Decidido em',
    arquivoEnviado: 'Arquivo enviado',
    arquivoMeta: (tamanho: string, data: string) => `${tamanho}${dominio.separador}enviado em ${data}`,
    baixar: 'Baixar',
    baixarDescricao: (arquivo: string) => `Baixar ${arquivo}`,
    baixarToast: 'Download disponível quando o portal estiver ligado à JotaNunes',
    anteriores: 'Envios anteriores',
    naoEnviadoTitle: 'Ainda não enviado',
    naoEnviado: (desde: string) => `A JotaNunes pede este documento desde ${desde}. Enquanto não for enviado, ele aparece como pendente — nada é bloqueado.`,
    emAnalise: 'A equipe da JotaNunes está analisando este envio. Você recebe o resultado por e-mail.',
    venceEmBreve: (dias: number) => `Vence em ${dias} dias. Envie a versão nova antes, para não ficar vencido.`,
    vencido: (data: string) => `Venceu em ${data}. Envie a versão nova para voltar a ficar em dia.`,
    cancelar: 'Cancelar',
    baixarArquivo: 'Baixar arquivo',
    enviar: 'Enviar documento',
    renovar: 'Renovar documento',
    reenviar: 'Reenviar documento',
    naoEncontradoTitle: 'Documento não encontrado',
    naoEncontradoDescription: 'O endereço pode estar incorreto. Feche o painel e escolha o documento na lista.',
  },
} as const;

import { dominio } from '../dominio';

/** Obras (/obras) e detalhe da obra (/obras/:id). */
export const obrasPage = {
  title: 'Obras',
  subtitle: 'Obras da JotaNunes em que a sua empresa está contratada.',
  caption: 'Suas obras',
  linha: (servico: string, periodo: string) => `${servico}${dominio.separador}${periodo}`,
  local: (codigo: string, cidadeUf: string) => `${codigo}${dominio.separador}${cidadeUf}`,
  contagem: (listas: number, funcionarios: number) => `${dominio.listas(listas)}${dominio.separador}${dominio.funcionarios(funcionarios)}`,
  semPendencia: 'Tudo em dia',
  abrir: 'Abrir obra',
  abrirDescricao: (obra: string) => `Abrir ${obra}`,
  vazioTitle: 'Nenhuma obra vinculada',
  vazioDescription: 'Quando a JotaNunes contratar sua empresa para uma obra, ela aparece aqui com o que é exigido.',
  detalhe: {
    voltar: 'Obras',
    subtitulo: (codigo: string, cidadeUf: string, servico: string, periodo: string) =>
      [codigo, cidadeUf, servico, periodo].join(dominio.separador),
    metricas: {
      exigidos: 'Documentos exigidos',
      exigidosHint: (listas: number) => `de ${dominio.listas(listas)}`,
      pendencias: 'Pendências nesta obra',
      pendenciasNenhuma: 'nenhuma — tudo em dia',
      /** "FGTS vencido e PCMSO pendente". */
      pendenciasLista: (itens: ReadonlyArray<{ curto: string; situacao: string }>) => {
        const partes = itens.map((i) => `${i.curto} ${i.situacao.toLowerCase()}`);
        return partes.length <= 1 ? (partes[0] ?? '') : `${partes.slice(0, -1).join(', ')} e ${partes[partes.length - 1] ?? ''}`;
      },
      alocadosResumo: (c: { emDia: number; emAnalise: number; pendente: number; reprovado: number }) =>
        [
          c.emDia > 0 ? `${c.emDia} em dia` : '',
          c.emAnalise > 0 ? `${c.emAnalise} em análise` : '',
          c.pendente > 0 ? `${c.pendente} ${c.pendente === 1 ? 'pendente' : 'pendentes'}` : '',
          c.reprovado > 0 ? `${c.reprovado} ${c.reprovado === 1 ? 'reprovado' : 'reprovados'}` : '',
        ]
          .filter(Boolean)
          .join(dominio.separador),
      alocados: 'Funcionários alocados',
      alocadosNenhum: 'ninguém cadastrado nesta obra',
    },
    exige: {
      title: 'O que esta obra exige da sua empresa',
      itens: (obrigatorios: number, opcionais: number, funcionario: number) =>
        [
          `${obrigatorios} ${obrigatorios === 1 ? 'documento obrigatório' : 'documentos obrigatórios'}`,
          opcionais > 0 ? `${opcionais} ${opcionais === 1 ? 'opcional' : 'opcionais'}` : '',
          funcionario > 0 ? '1 item de funcionários' : '',
        ]
          .filter(Boolean)
          .join(dominio.separador),
      verDocumentos: 'Ver documentos',
      verDocumentosDescricao: (lista: string) => `Ver documentos de ${lista}`,
      vazio: 'Esta obra ainda não tem lista de exigências para o seu tipo de fornecimento.',
    },
    funcionarios: {
      title: 'Seus funcionários nesta obra',
      adicionar: 'Adicionar funcionários',
      caption: 'Funcionários nesta obra',
      ver: 'Ver',
      vazioTitle: 'Ninguém cadastrado nesta obra',
      vazioDescription: 'Cadastre quem vai trabalhar no canteiro: você preenche os dados da pessoa, anexa os documentos dela e envia até 10 por vez.',
    },
    naoEncontradaTitle: 'Obra não encontrada',
    naoEncontradaDescription: 'O endereço pode estar incorreto. Volte para a lista de obras.',
    naoEncontradaAction: 'Ver obras',
  },
} as const;

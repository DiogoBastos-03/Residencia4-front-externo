import { dominio } from '../dominio';

/** Envio, renovação e reenvio de documento (no painel lateral). */
export const envioPage = {
  titulo: { enviar: 'Enviar documento', renovar: 'Renovar documento', reenviar: 'Reenviar documento' },
  venceuEm: (data: string) => `venceu em ${data}`,
  exigidoDesde: (data: string) => `exigido desde ${data}`,
  arquivo: 'Arquivo',
  arraste: 'Arraste o arquivo aqui',
  formatos: 'PDF, JPG ou PNG, até 20 MB',
  escolher: 'Escolher arquivo',
  remover: (nome: string) => `Remover ${nome}`,
  pronto: (tamanho: string) => `${tamanho}${dominio.separador}pronto para enviar`,
  erroFormato: 'Formato não aceito. Envie PDF, JPG ou PNG.',
  erroTamanho: 'Arquivo maior que 20 MB. Reduza o tamanho e tente de novo.',
  erroSemArquivo: 'Escolha o arquivo do documento.',
  validade: 'Validade do documento',
  validadePlaceholder: 'dd/mm/aaaa',
  erroValidade: 'Informe a validade que está no documento, no formato dd/mm/aaaa.',
  erroValidadePassada: 'Esta data já passou. Confira a validade no documento.',
  tipoArquivo: 'Tipo de arquivo',
  tiposArquivo: [
    { value: 'orgao', label: 'Certidão emitida pelo órgão' },
    { value: 'digitalizado', label: 'Cópia digitalizada do original' },
    { value: 'foto', label: 'Foto do documento' },
  ],
  observacao: 'Observação para a equipe',
  opcional: '(opcional)',
  observacaoPlaceholder: 'Algo que a equipe precise saber sobre este envio',
  infoEmpresa: {
    texto: 'Este documento é da empresa. Você envia uma vez e ele atende todas as obras que o exigem. A equipe da JotaNunes analisa e você recebe o resultado por e-mail.',
  },
  infoFuncionario: {
    titulo: (pessoa: string) => `Vale só para ${pessoa}`,
    texto: 'Este arquivo é de uma pessoa. Os outros documentos dela continuam como estão. A equipe da JotaNunes analisa e você recebe o resultado por e-mail.',
  },
  cancelar: 'Cancelar',
  enviar: 'Enviar para análise',
  erroTopo: 'Revise o que está marcado antes de enviar.',
  confirmar: {
    title: 'Enviar para análise?',
    texto: (nome: string) => `${nome} vai para a fila da equipe de Suprimentos. Você recebe o resultado por e-mail.`,
    voltar: 'Voltar',
    confirmar: 'Enviar documento',
  },
  toast: 'Documento enviado para análise',
} as const;

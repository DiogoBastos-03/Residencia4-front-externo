/** Formatos e tamanho aceitos em qualquer envio. */
const EXTENSOES = ['pdf', 'jpg', 'jpeg', 'png'] as const;
export const ARQUIVO_MAX_MB = 20;

/** Arquivo escolhido para envio — só o que a interface precisa mostrar. */
export type ArquivoEscolhido = { nome: string; tamanhoKb: number };

export type ProblemaArquivo = 'formato' | 'tamanho';

/** null quando o arquivo pode ser enviado. */
export function validarArquivo(arquivo: ArquivoEscolhido): ProblemaArquivo | null {
  const extensao = arquivo.nome.split('.').pop()?.toLowerCase() ?? '';
  if (!EXTENSOES.some((e) => e === extensao)) return 'formato';
  if (arquivo.tamanhoKb > ARQUIVO_MAX_MB * 1000) return 'tamanho';
  return null;
}

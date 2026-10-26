import { common } from './common';

/**
 * Vocabulário do produto usado em várias telas. Trocar "lista de exigências"
 * por outro termo é editar aqui. Nunca "workflow".
 */
const plural = (n: number, um: string, varios: string) => (n === 1 ? `1 ${um}` : `${n} ${varios}`);
const tipo = { servico: 'serviço', material: 'material' } as const;

export const dominio = {
  plural,
  listas: (n: number) => plural(n, 'lista de exigências', 'listas de exigências'),
  obras: (n: number) => plural(n, 'obra', 'obras'),
  funcionarios: (n: number) => plural(n, 'funcionário', 'funcionários'),
  pendencias: (n: number) => plural(n, 'pendência', 'pendências'),
  arquivos: (n: number) => plural(n, 'arquivo', 'arquivos'),
  itens: (n: number) => plural(n, 'item', 'itens'),
  tipo,
  /** "Fornecedor de serviço" / "Fornecedor de serviço e material". */
  fornecedorDe: (tipos: readonly (keyof typeof tipo)[]) => `Fornecedor de ${tipos.map((t) => tipo[t]).join(' e ')}`,
  /** "Exigido nas suas 3 obras" / "Exigido em Residencial Mirante do Parque". */
  exigidoEm: (obras: readonly string[]) =>
    obras.length === 1 ? `Exigido em ${obras[0] ?? ''}` : `Exigido nas suas ${obras.length} obras`,
  valeEm: (obras: readonly string[]) => (obras.length === 1 ? `Vale para ${obras[0] ?? ''}` : `Vale para as suas ${obras.length} obras`),
  emDia: (feitos: number, total: number) => `${feitos} de ${total} em dia`,
  deTotal: (feitos: number, total: number) => `${feitos} de ${total}`,
  periodo: (inicio: string, fim: string) => `${inicio} – ${fim}`,
  cidadeUf: (cidade: string, uf: string) => `${cidade}/${uf}`,
  tamanho: (kb: number) => (kb >= 1000 ? `${(kb / 1000).toFixed(1).replace('.', ',')} MB` : `${kb} KB`),
  /** "Rodrigo Alves · JotaNunes". */
  daJotaNunes: (nome: string) => `${nome} · ${common.jotanunes}`,
  motivos: {
    ilegivel: 'Documento ilegível.',
    foraValidade: 'Fora da validade.',
    incorreto: 'Documento incorreto.',
    faltaAssinatura: 'Falta assinatura.',
  },
  motivoCurto: {
    ilegivel: 'documento ilegível',
    foraValidade: 'fora da validade',
    incorreto: 'documento incorreto',
    faltaAssinatura: 'falta assinatura',
  },
  acoes: { enviar: 'Enviar', renovar: 'Renovar', reenviar: 'Reenviar', ver: 'Ver' },
  separador: ` ${common.separator} `,
} as const;

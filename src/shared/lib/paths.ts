/** Endereços das rotas. Use estas funções em vez de montar URL à mão. */
export const paths = {
  entrar: '/entrar',
  esqueciSenha: '/entrar/esqueci-a-senha',
  inicio: '/',
  documentos: '/documentos',
  /** Painel lateral do documento (da empresa ou arquivo de funcionário). `enviar` abre o envio. */
  documento: (id: string, enviar = false) => `/documentos/${id}${enviar ? '?acao=enviar' : ''}`,
  obras: '/obras',
  obra: (id: string) => `/obras/${id}`,
  funcionarios: '/funcionarios',
  /** Painel lateral da pessoa. `reenviar`: tipo de documento a reenviar, abre o envio no mesmo painel. */
  funcionario: (id: string, reenviar?: string) => `/funcionarios/${id}${reenviar ? `?reenviar=${reenviar}` : ''}`,
  /** Painel de remessa (adicionar funcionários), opcionalmente já numa obra. */
  novaRemessa: (obraId?: string) => `/funcionarios?remessa=nova${obraId ? `&remessaObra=${obraId}` : ''}`,
  historico: '/historico',
  empresa: '/dados-da-empresa',
  estados: '/_estados',
  componentes: '/_componentes',
} as const;

/** Entrar (/entrar) e esqueci a senha (/entrar/esqueci-a-senha). */
export const acessoPage = {
  entrar: {
    documentTitle: 'Entrar',
    title: 'Entrar no portal',
    subtitle: 'Use o CNPJ da empresa e a senha que a JotaNunes enviou.',
    cnpj: 'CNPJ',
    cnpjPlaceholder: '00.000.000/0000-00',
    cnpjErro: 'CNPJ inválido. Confira os 14 dígitos.',
    senha: 'Senha',
    senhaErro: 'Informe a senha.',
    esqueci: 'Esqueci a senha',
    entrar: 'Entrar',
    entrando: 'Entrando…',
    erroCredenciais: 'CNPJ ou senha incorretos. Confira e tente de novo.',
    ajuda: 'Não tem acesso? A credencial é criada pela JotaNunes — fale com o setor de Suprimentos.',
  },
  esqueci: {
    documentTitle: 'Esqueci a senha',
    title: 'Esqueci a senha',
    subtitle: 'Informe o e-mail de notificações da empresa. Enviamos um link para criar uma senha nova.',
    email: 'E-mail',
    emailErro: 'Informe um e-mail válido.',
    enviar: 'Enviar link',
    voltar: 'Voltar para entrar',
    confirmadoTitle: 'Confira seu e-mail',
    confirmado: (email: string) => `Se ${email} for o e-mail de notificações de uma empresa cadastrada, o link chega em alguns minutos. Ele vale por 1 hora.`,
  },
} as const;

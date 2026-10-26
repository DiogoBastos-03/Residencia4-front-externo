/** Data ISO: "2026-09-16" ou com hora, "2026-09-16T14:30". */
export type IsoDate = string;

export type TipoFornecimento = 'servico' | 'material';

export type Obrigatoriedade = 'obrigatorio' | 'opcional';

/** Documento da empresa (um arquivo, vale para todas as obras) ou de funcionário (um arquivo por pessoa). */
export type EscopoItem = 'empresa' | 'funcionario';

/** Situação exibida de um documento ou arquivo. */
export type Situacao = 'aprovado' | 'emAnalise' | 'pendente' | 'venceEmBreve' | 'vencido' | 'reprovado';

export type MotivoReprovacao = 'ilegivel' | 'foraValidade' | 'incorreto' | 'faltaAssinatura';

/** Quem fez algo: a própria empresa (você) ou alguém da equipe da JotaNunes. */
export type Autor = { kind: 'voce' } | { kind: 'jotanunes'; nome: string };

/** Um arquivo que foi enviado. */
export type ArquivoEnviado = {
  nome: string;
  tamanhoKb: number;
  enviadoEm: IsoDate;
};

/** Decisão da JotaNunes sobre um envio. Toda reprovação tem motivo. */
export type Decisao = {
  por: string;
  em: IsoDate;
  motivo?: MotivoReprovacao;
  /** Explicação da equipe, junto do motivo. */
  observacao?: string;
};

export type EnvioAnterior = {
  arquivo: string;
  enviadoEm: IsoDate;
  resultado: 'aprovado' | 'reprovado';
};

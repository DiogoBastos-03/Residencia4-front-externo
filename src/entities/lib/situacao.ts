import type { IsoDate, Situacao } from '../common';
import type { DocumentoEmpresa, StatusEnvio } from '../documento';
import type { ArquivoFuncionario } from '../funcionario';
import { diasEntre, JANELA_VENCIMENTO_DIAS } from './datas';

/** Aprovado com validade vira "vence em breve" (até 30 dias) ou "vencido". */
export function situacaoPorValidade(status: StatusEnvio, validade: IsoDate | undefined, hoje: IsoDate): Situacao {
  if (status !== 'aprovado' || !validade) return status;
  const restantes = diasEntre(hoje, validade);
  if (restantes < 0) return 'vencido';
  if (restantes <= JANELA_VENCIMENTO_DIAS) return 'venceEmBreve';
  return 'aprovado';
}

export function situacaoDocumento(doc: DocumentoEmpresa | undefined, hoje: IsoDate): Situacao {
  if (!doc) return 'pendente';
  return situacaoPorValidade(doc.status, doc.validade, hoje);
}

export function situacaoArquivo(arquivo: ArquivoFuncionario | undefined, hoje: IsoDate): Situacao {
  if (!arquivo) return 'pendente';
  return situacaoPorValidade(arquivo.status, arquivo.validade, hoje);
}

/** Conta como em dia: aprovado e ainda válido. */
export function estaEmDia(s: Situacao): boolean {
  return s === 'aprovado' || s === 'venceEmBreve';
}

/** Precisa de ação da empresa: enviar, renovar ou reenviar. Nunca bloqueia nada. */
export function ehPendencia(s: Situacao): boolean {
  return s === 'pendente' || s === 'vencido' || s === 'reprovado';
}

/** Ação que a empresa pode tomar sobre o documento. */
export type AcaoDocumento = 'enviar' | 'renovar' | 'reenviar' | 'ver';

export function acaoPara(s: Situacao): AcaoDocumento {
  if (s === 'pendente') return 'enviar';
  if (s === 'vencido') return 'renovar';
  if (s === 'reprovado') return 'reenviar';
  return 'ver';
}

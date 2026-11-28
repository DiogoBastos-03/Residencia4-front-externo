const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailValido(valor: string): boolean {
  return EMAIL.test(valor.trim());
}

/** Confere os dígitos verificadores do CPF. */
export function cpfValido(valor: string): boolean {
  const d = valor.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const digito = (base: string, peso: number) => {
    const soma = base.split('').reduce((t, n, i) => t + Number(n) * (peso - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(d.slice(0, 9), 10) === Number(d[9]) && digito(d.slice(0, 10), 11) === Number(d[10]);
}

export type ProblemaSenha = 'curta' | 'longa' | 'maiuscula' | 'minuscula' | 'numero' | 'especial';

/**
 * Política de senha da API: 8 caracteres a 72 bytes UTF-8, com maiúscula, minúscula, número
 * e caractere especial (espaço não conta). Devolve a primeira regra violada, ou `null`.
 */
export function problemaSenha(senha: string): ProblemaSenha | null {
  if (senha.length < 8) return 'curta';
  if (new TextEncoder().encode(senha).length > 72) return 'longa';
  if (!/\p{Lu}/u.test(senha)) return 'maiuscula';
  if (!/\p{Ll}/u.test(senha)) return 'minuscula';
  if (!/\p{N}/u.test(senha)) return 'numero';
  if (!/[^\p{L}\p{N}\s]/u.test(senha)) return 'especial';
  return null;
}

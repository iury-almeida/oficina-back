/**
 * Normaliza CPF ou CNPJ removendo pontuação (apenas dígitos).
 * CPF: 11 dígitos | CNPJ: 14 dígitos
 */
export function normalizeDocument(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Valida se o documento possui tamanho válido (CPF 11 ou CNPJ 14 dígitos).
 */
export function isValidDocumentLength(value: string): boolean {
  const digits = normalizeDocument(value);
  return digits.length === 11 || digits.length === 14;
}

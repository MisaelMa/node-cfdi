import { FORBIDDEN_WORD } from './common/constants';
import { checkDigit } from './utils/checkDigit';

const VOWELS = 'AEIOU';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const HOMOCLAVE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const pick = (chars: string): string =>
  chars[Math.floor(Math.random() * chars.length)];

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Genera una fecha valida en formato YYMMDD */
const randomDateStr = (): string => {
  const year = randomInt(30, 99); // 1930-1999 para evitar fechas futuras
  const month = randomInt(1, 12);
  const daysInMonth = new Date(1900 + year, month, 0).getDate();
  const day = randomInt(1, daysInMonth);
  return `${pad2(year)}${pad2(month)}${pad2(day)}`;
};

/** Genera 2 caracteres de homoclave (sin el digito verificador) */
const randomHomoclave2 = (): string =>
  pick(HOMOCLAVE_CHARS) + pick(HOMOCLAVE_CHARS);

/**
 * Verifica si el prefijo de 4 letras esta en la lista de palabras prohibidas.
 * Para persona moral el prefijo es de 3 letras, la funcion revisa solo los
 * primeros 4 caracteres del RFC completo.
 */
const hasForbiddenPrefix = (prefix: string): boolean =>
  FORBIDDEN_WORD.includes(prefix.toUpperCase().slice(0, 4));

/** Genera un prefijo de 4 letras valido para persona fisica (AANC pattern) */
const personaFisicaPrefix = (): string => {
  let prefix: string;
  do {
    // Patron SAT: primera letra apellido paterno, vocal interna, letra apellido
    // materno, primera letra nombre — simplificado con letras aleatorias validas
    prefix =
      pick(LETTERS) + pick(VOWELS) + pick(LETTERS) + pick(LETTERS);
  } while (hasForbiddenPrefix(prefix));
  return prefix;
};

/** Genera un prefijo de 3 letras valido para persona moral */
const personaMoralPrefix = (): string => {
  let prefix: string;
  do {
    prefix = pick(LETTERS) + pick(LETTERS) + pick(LETTERS);
  } while (hasForbiddenPrefix(prefix + 'A')); // verifica con una cuarta letra hipotetica
  return prefix;
};

export class RfcFaker {
  /**
   * Genera un RFC aleatorio valido para persona fisica (13 caracteres).
   */
  static persona(): string {
    let rfc: string;
    do {
      const prefix = personaFisicaPrefix();
      const date = randomDateStr();
      const homo2 = randomHomoclave2();
      const base = `${prefix}${date}${homo2}`;
      const digit = checkDigit(base + '0'); // checkDigit necesita 13 chars
      rfc = `${base}${digit}`;
    } while (rfc.length !== 13);
    return rfc;
  }

  /**
   * Genera un RFC aleatorio valido para persona moral (12 caracteres).
   */
  static moral(): string {
    let rfc: string;
    do {
      const prefix = personaMoralPrefix();
      const date = randomDateStr();
      const homo2 = randomHomoclave2();
      const base = `${prefix}${date}${homo2}`;
      const digit = checkDigit(base + '0'); // checkDigit maneja 12 chars con padding
      rfc = `${base}${digit}`;
    } while (rfc.length !== 12);
    return rfc;
  }
}

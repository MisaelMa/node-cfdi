import { SPECIAL_CASES } from '../common/constants';
import { validate } from '../rfc';

export class InvalidRfcError extends Error {
  constructor(rfc: string) {
    super(`'${rfc}' is not a valid RFC`);
    this.name = 'InvalidRfcError';
  }
}

/**
 * RFCs especiales del SAT que son validos por definicion reglamentaria,
 * independientemente del digito verificador.
 */
const SPECIAL_RFC_VALUES = Object.keys(SPECIAL_CASES);

export class Rfc {
  private constructor(private readonly _value: string) {}

  /**
   * Factory principal: valida y lanza InvalidRfcError si el RFC es invalido.
   * Los RFCs especiales (generico y extranjero) son aceptados por definicion.
   */
  static of(rfc: string): Rfc {
    const normalized = String(rfc).trim().toUpperCase();
    if (SPECIAL_RFC_VALUES.includes(normalized)) {
      return new Rfc(normalized);
    }
    const result = validate(rfc);
    if (!result.isValid) {
      throw new InvalidRfcError(rfc);
    }
    return new Rfc(result.rfc);
  }

  /**
   * Factory segura: retorna null si el RFC es invalido.
   */
  static parse(rfc: string): Rfc | null {
    try {
      return Rfc.of(rfc);
    } catch {
      return null;
    }
  }

  static isValid(rfc: string): boolean {
    const normalized = String(rfc).trim().toUpperCase();
    if (SPECIAL_RFC_VALUES.includes(normalized)) return true;
    return validate(rfc).isValid;
  }

  toString(): string {
    return this._value;
  }

  /** Persona fisica: 13 caracteres (excluye genericos/extranjeros) */
  isFisica(): boolean {
    return this._value.length === 13 && !this.isGeneric() && !this.isForeign();
  }

  /** Persona moral: 12 caracteres */
  isMoral(): boolean {
    return this._value.length === 12;
  }

  /** RFC generico del SAT: XAXX010101000 */
  isGeneric(): boolean {
    return this._value === 'XAXX010101000';
  }

  /** RFC para operaciones con extranjeros: XEXX010101000 */
  isForeign(): boolean {
    return this._value === 'XEXX010101000';
  }

  /**
   * Extrae la fecha de nacimiento/constitucion codificada en el RFC (YYMMDD).
   * Retorna null para RFCs especiales (generico y extranjero).
   */
  obtainDate(): Date | null {
    if (this.isGeneric() || this.isForeign()) return null;

    // Persona moral (12 chars):  AAA + YYMMDD + HHH  -> slice(3, 9)
    // Persona fisica (13 chars): AAAA + YYMMDD + HHH  -> slice(4, 10)
    const dateStr =
      this._value.length === 12
        ? this._value.slice(3, 9)
        : this._value.slice(4, 10);

    const year = parseInt(dateStr.slice(0, 2), 10);
    const month = parseInt(dateStr.slice(2, 4), 10) - 1;
    const day = parseInt(dateStr.slice(4, 6), 10);

    // Heuristica de siglo: si YY <= anio actual => 2000s, si no => 1900s
    const currentYear = new Date().getFullYear() % 100;
    const century = year <= currentYear ? 2000 : 1900;

    const date = new Date(century + year, month, day);
    if (isNaN(date.getTime())) return null;
    return date;
  }

  equals(other: Rfc): boolean {
    return this._value === other._value;
  }
}

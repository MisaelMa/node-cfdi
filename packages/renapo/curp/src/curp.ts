import { FORBIDDEN_WORDS, REGEX_CURP, STATE } from "./common/constants";
import { checkDigit } from "./utils/getCheckDigit";

let curp: string = ''
export class BadCurpFormat extends Error {
  constructor(curp: string) {
    super(`'${curp}' is an invalid curp`);
  }
}

const parseInput = (input: string) => String(input)
  .trim()
  .toUpperCase()
  .replace(/[^0-9A-Z]/g, '');

const validateDate = (input: string) => {
  const dateStr = curp.slice(4, 10);
  const year = dateStr.slice(0, 2);
  const month = dateStr.slice(2, 4);
  const day = dateStr.slice(4, 6);
  const date = new Date(`20${year}-${month}-${day}`);
  return !Number.isNaN(date.getTime());
};

const validateCheckDigit = (input: string) => {
  const digit = input.slice(-1);
  const expected = checkDigit(input);
  return expected === digit;
};

const validateState = (input: string) => {
  const state = (input || '').slice(11, 13);
  return STATE.includes(state);
};

export const getState = (curp: string) => {
  const macth = REGEX_CURP.exec(curp);
  if (macth && macth[3]) {
    return macth[3]
  }
  return '0';
}

export const validateLocal = (input: string) => {
  curp = parseInput(input)
  const result = {
    isValid: false,
    rfc: curp || '',
    error: []
  }
  const match = REGEX_CURP.exec(curp);
  if (match && !hasForbiddenWords()) {
    result.isValid = true
  }

  return result;
}
export const validate = (input: string) => {
  curp = parseInput(input)
  const result = {
    isValid: false,
    rfc: curp || '',
  }

  const match = REGEX_CURP.exec(curp);
  if (match && !hasForbiddenWords() && validateDate(curp) && validateState(curp) && validateCheckDigit(curp)) {
    result.isValid = true
  }
  return true
}

const hasForbiddenWords = (): boolean => {
  const prefix = (curp || '').slice(0, 4);
  return FORBIDDEN_WORDS.includes(prefix);
};

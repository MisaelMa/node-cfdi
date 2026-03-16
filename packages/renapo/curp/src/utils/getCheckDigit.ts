// @ts-ignore
const VALUES_MAP: { [key: string | number]: number } = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
  G: 16,
  H: 17,
  I: 18,
  J: 19,
  K: 20,
  L: 21,
  M: 22,
  N: 23,
  Ñ: 24,
  O: 25,
  P: 26,
  Q: 27,
  R: 28,
  S: 29,
  T: 30,
  U: 31,
  V: 32,
  W: 33,
  X: 34,
  Y: 35,
  Z: 36,
};

const getScore = (string: string) => string.split('').reduce((sum, char: number | string, i) => {
  const index = 18 - i;
  // @ts-ignore
  const value = VALUES_MAP[char] || 0;
  return sum + value * index;
}, 0);

export const checkDigit = (curp: string) => {
  const base = curp.slice(0, -1);
  const score = getScore(base);
  const mod = score % 10;
  if (mod === 0) return '0';
  return String(10 - mod);
};

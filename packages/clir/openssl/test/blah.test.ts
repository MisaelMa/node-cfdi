import { x509 } from "../src"
const cli = x509.inform('DER').in("amir").noout().pubkey();

describe('blah', () => {
  it('works', () => {
    expect(sum(1, 1)).toEqual(2);
  });
});

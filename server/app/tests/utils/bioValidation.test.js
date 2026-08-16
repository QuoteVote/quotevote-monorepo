import { expect } from 'chai';
import { normalizeBio, BIO_MAX_LENGTH } from '~/utils/bioValidation';

describe('utils > bioValidation > normalizeBio', () => {
  it('trims surrounding whitespace', () => {
    expect(normalizeBio('  hello there  ')).to.equal('hello there');
  });

  it('returns an empty string for null and undefined', () => {
    expect(normalizeBio(null)).to.equal('');
    expect(normalizeBio(undefined)).to.equal('');
  });

  it('accepts text at exactly the maximum length', () => {
    const atLimit = 'a'.repeat(BIO_MAX_LENGTH);
    expect(normalizeBio(atLimit)).to.equal(atLimit);
  });

  it('rejects text longer than the maximum length', () => {
    expect(() => normalizeBio('a'.repeat(BIO_MAX_LENGTH + 1)))
      .to.throw(`About must be ${BIO_MAX_LENGTH} characters or fewer`);
  });

  it('measures length after trimming, so padding does not push it over', () => {
    const padded = `  ${'a'.repeat(BIO_MAX_LENGTH)}  `;
    expect(normalizeBio(padded)).to.have.lengthOf(BIO_MAX_LENGTH);
  });

  it('rejects HTML markup', () => {
    expect(() => normalizeBio('<b>bold</b>')).to.throw('About must be plain text without HTML');
    expect(() => normalizeBio('<script>alert(1)</script>')).to.throw('plain text without HTML');
    expect(() => normalizeBio('<img src=x onerror=y>')).to.throw('plain text without HTML');
  });

  it('allows angle brackets that are not markup', () => {
    expect(normalizeBio('a < b and c > d')).to.equal('a < b and c > d');
  });

  it('rejects non-string input', () => {
    expect(() => normalizeBio(42)).to.throw('About must be text');
    expect(() => normalizeBio({})).to.throw('About must be text');
  });
});

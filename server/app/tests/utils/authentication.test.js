import jwt from 'jsonwebtoken';
import { expect } from 'chai';
import { getAuthSecret, verifyToken } from '~/utils/authentication';

const SECRET = 'test-secret-value';

const signToken = (payload, options = {}) => jwt.sign(payload, SECRET, options);

describe('utils > authentication', () => {
  let originalSecret;

  beforeEach(() => {
    originalSecret = process.env.SECRET;
    process.env.SECRET = SECRET;
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.SECRET;
    } else {
      process.env.SECRET = originalSecret;
    }
  });

  describe('getAuthSecret', () => {
    it('returns the configured SECRET', () => {
      expect(getAuthSecret()).to.equal(SECRET);
    });

    it('throws when SECRET is unset rather than returning undefined', () => {
      delete process.env.SECRET;
      expect(() => getAuthSecret()).to.throw(/SECRET is not set/);
    });
  });

  describe('verifyToken', () => {
    // Regression guard: signing and verification must read the same variable.
    // When they diverged, every token in production failed verification.
    it('verifies a token signed with the same secret used for signing', () => {
      const token = signToken({ _id: 'user-1', admin: true });
      const decoded = verifyToken(token);

      expect(decoded._id).to.equal('user-1');
      expect(decoded.admin).to.equal(true);
    });

    it('accepts a token with the Bearer prefix', () => {
      const token = signToken({ _id: 'user-1' });

      expect(verifyToken(`Bearer ${token}`)._id).to.equal('user-1');
    });

    it('rejects a token signed with a different secret', () => {
      const token = jwt.sign({ _id: 'user-1' }, 'some-other-secret');

      expect(() => verifyToken(token)).to.throw(/Invalid access token/);
    });

    it('rejects an expired token', () => {
      const token = signToken({ _id: 'user-1' }, { expiresIn: '-1s' });

      expect(() => verifyToken(token)).to.throw(/expired/);
    });

    it('rejects a missing or non-string token', () => {
      expect(() => verifyToken(undefined)).to.throw(/missing or invalid/);
      expect(() => verifyToken(null)).to.throw(/missing or invalid/);
      expect(() => verifyToken(12345)).to.throw(/missing or invalid/);
    });

    // Falling through the catch returned `undefined`, which the GraphQL context
    // accepted as a valid user and later dereferenced as `user._id`.
    it('throws rather than returning undefined for a not-yet-valid token', () => {
      const token = signToken({ _id: 'user-1' }, { notBefore: '1h' });

      expect(() => verifyToken(token)).to.throw();
    });

    it('surfaces a missing secret as a configuration error, not an auth failure', () => {
      const token = signToken({ _id: 'user-1' });
      delete process.env.SECRET;

      expect(() => verifyToken(token)).to.throw(/SECRET is not set/);
    });
  });
});

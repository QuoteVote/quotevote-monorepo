import { expect } from 'chai';
import {
  assertAllowedWithoutUser,
  collectRequestQueries,
  resolveTokenUser,
} from '~/utils/contextAuth';

const PUBLIC_QUERY = 'query { posts(limit: 5) { entities { _id } } }';
const PROTECTED_QUERY = 'query { notifications { _id } }';

describe('utils > contextAuth', () => {
  describe('collectRequestQueries', () => {
    it('reads the body query of a POST', () => {
      const req = { body: { query: PUBLIC_QUERY }, query: {} };
      expect(collectRequestQueries(req)).to.deep.equal([PUBLIC_QUERY]);
    });

    it('reads the URL query of a GET', () => {
      const req = { body: {}, query: { query: PROTECTED_QUERY } };
      expect(collectRequestQueries(req)).to.deep.equal([PROTECTED_QUERY]);
    });

    it('returns both when a request carries a body query and a URL query', () => {
      const req = { body: { query: PUBLIC_QUERY }, query: { query: PROTECTED_QUERY } };
      expect(collectRequestQueries(req)).to.deep.equal([PUBLIC_QUERY, PROTECTED_QUERY]);
    });

    it('keeps empty and non-string values so they can be rejected', () => {
      const req = { body: { query: '' }, query: { query: { nested: true } } };
      expect(collectRequestQueries(req)).to.deep.equal(['', { nested: true }]);
    });

    it('returns nothing for a request without query text', () => {
      expect(collectRequestQueries({ body: {}, query: {} })).to.deep.equal([]);
      expect(collectRequestQueries(undefined)).to.deep.equal([]);
    });
  });

  describe('resolveTokenUser', () => {
    it('returns the user for a valid token', async () => {
      const user = { _id: 'u1' };
      expect(await resolveTokenUser('good', async () => user)).to.equal(user);
    });

    it('treats a token that fails verification as no token', async () => {
      const verify = async () => { throw new Error('jwt malformed'); };
      expect(await resolveTokenUser('junk', verify)).to.equal(null);
    });

    it('returns null without calling verify when there is no token', async () => {
      let called = false;
      const verify = async () => { called = true; return {}; };
      expect(await resolveTokenUser('', verify)).to.equal(null);
      expect(await resolveTokenUser(undefined, verify)).to.equal(null);
      expect(called).to.equal(false);
    });
  });

  describe('assertAllowedWithoutUser', () => {
    it('allows public queries', () => {
      expect(() => assertAllowedWithoutUser([PUBLIC_QUERY])).to.not.throw();
    });

    it('allows introspection through the allowlist, whatever the operation is called', () => {
      const introspection = 'query IntrospectionQuery { __schema { queryType { name } } }';
      expect(() => assertAllowedWithoutUser([introspection])).to.not.throw();
    });

    it('rejects a protected query even when it is named IntrospectionQuery', () => {
      const disguised = 'query IntrospectionQuery { notifications { _id } }';
      expect(() => assertAllowedWithoutUser([disguised])).to.throw('Auth token not found in request');
    });

    it('rejects a protected query', () => {
      expect(() => assertAllowedWithoutUser([PROTECTED_QUERY])).to.throw('Auth token not found in request');
    });

    it('rejects when any of the queries a request carries is protected', () => {
      expect(() => assertAllowedWithoutUser([PUBLIC_QUERY, PROTECTED_QUERY])).to.throw('Auth token not found in request');
    });

    it('rejects empty and non-string query values', () => {
      expect(() => assertAllowedWithoutUser([''])).to.throw('Auth token not found in request');
      expect(() => assertAllowedWithoutUser([{ nested: true }])).to.throw('Auth token not found in request');
    });

    it('allows a request without query text', () => {
      expect(() => assertAllowedWithoutUser([])).to.not.throw();
    });
  });
});

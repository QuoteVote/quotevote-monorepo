import { expect } from 'chai';
import requireAuth, { getRootFieldNames } from '~/utils/requireAuth';

describe('utils > requireAuth', () => {
  describe('public operations', () => {
    it('allows a public query', () => {
      expect(requireAuth('query { posts(limit: 5) { entities { _id } } }')).to.equal(false);
    });

    it('allows public search used by the logged-out landing page', () => {
      const query = 'query search($text: String!) { posts(searchKey: $text) { entities { _id } } searchUser(queryName: $text) { _id username } }';
      expect(requireAuth(query)).to.equal(false);
    });

    it('allows introspection fields', () => {
      expect(requireAuth('query { __schema { queryType { name } } }')).to.equal(false);
    });
  });

  describe('gated operations', () => {
    it('gates an authenticated query', () => {
      expect(requireAuth('query { notifications { _id } }')).to.equal(true);
    });

    it('gates mutations', () => {
      expect(requireAuth('mutation { addPost(post: {}) { _id } } ')).to.equal(true);
      expect(requireAuth('mutation { disableUser(userId: "1") { _id } }')).to.equal(true);
    });

    it('gates when any root field is not public, even alongside a public one', () => {
      expect(requireAuth('query { posts { entities { _id } } notifications { _id } }')).to.equal(true);
    });
  });

  // The whole point of the rewrite: matching used to be String.includes over
  // the entire document, so mentioning a public name anywhere opened the gate.
  describe('substring loophole is closed', () => {
    it('does not treat a nested post selection as public', () => {
      const query = 'query { notifications { _id post { _id url } } }';
      expect(requireAuth(query)).to.equal(true);
    });

    it('does not treat a userId field as making an operation public', () => {
      expect(requireAuth('query { getRoster { _id userId } }')).to.equal(true);
    });

    it('does not treat an operation name containing "post" as public', () => {
      expect(requireAuth('mutation reportPost { reportPost(postId: "1", userId: "2") { _id } }')).to.equal(true);
    });

    it('does not treat a string argument mentioning a public name as public', () => {
      expect(requireAuth('query { getBuddyList(filter: "posts") { _id } }')).to.equal(true);
    });
  });

  describe('fails closed', () => {
    it('requires auth for an unparseable document', () => {
      expect(requireAuth('query { this is not graphql')).to.equal(true);
    });

    it('requires auth for a missing or non-string query', () => {
      expect(requireAuth(undefined)).to.equal(true);
      expect(requireAuth(null)).to.equal(true);
      expect(requireAuth('')).to.equal(true);
      expect(requireAuth(42)).to.equal(true);
    });

    it('requires auth for a document with only fragments and no operation', () => {
      expect(requireAuth('fragment F on Post { _id }')).to.equal(true);
    });
  });

  describe('getRootFieldNames', () => {
    it('reads root fields from a query', () => {
      expect(getRootFieldNames('query { posts { _id } user(username: "a") { _id } }'))
        .to.deep.equal(['posts', 'user']);
    });

    it('ignores nested fields', () => {
      expect(getRootFieldNames('query { posts { entities { creator { username } } } }'))
        .to.deep.equal(['posts']);
    });

    it('resolves a root fragment spread', () => {
      const query = 'query { ...Roots } fragment Roots on Query { posts { _id } }';
      expect(getRootFieldNames(query)).to.deep.equal(['posts']);
    });

    it('resolves a root inline fragment', () => {
      expect(getRootFieldNames('query { ... on Query { posts { _id } } }'))
        .to.deep.equal(['posts']);
    });

    it('returns null for an unparseable document', () => {
      expect(getRootFieldNames('{{{')).to.equal(null);
    });
  });
});

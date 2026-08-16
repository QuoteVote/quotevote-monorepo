import sinon from 'sinon';
import { expect } from 'chai';
import PresenceModel from '~/resolvers/models/PresenceModel';
import { resolvers } from '~/resolvers';

// resolvers/subscriptions imports GRAPHQL_PORT from server.js; importing it for
// real would boot Apollo and Mongo. See heartbeat.test.js for the same stub.
jest.mock('~/resolvers/subscriptions', () => ({
  pubsub: { publish: jest.fn().mockResolvedValue(undefined) },
  Subscription: {},
}));

/**
 * Regression guard: user_relationship was exported but never added to the
 * resolver map, so its field resolvers never ran — User.reputation returns
 * null in production because of it. A field resolver that is not wired fails
 * silently, so assert the wiring itself, not just that the function exists.
 */
describe('resolvers > User field resolvers are wired', () => {
  it('exposes User.presence in the resolver map', () => {
    expect(resolvers.User).to.be.an('object');
    expect(resolvers.User.presence).to.be.a('function');
  });

  describe('User.presence', () => {
    let findOneStub;

    beforeEach(() => {
      findOneStub = sinon.stub(PresenceModel, 'findOne');
    });

    afterEach(() => {
      findOneStub.restore();
    });

    it('looks up presence by the parent user id', async () => {
      const doc = { userId: 'user-1', status: 'away' };
      findOneStub.resolves(doc);

      const result = await resolvers.User.presence({ _id: 'user-1' });

      expect(result).to.equal(doc);
      sinon.assert.calledWith(findOneStub, { userId: 'user-1' });
    });

    it('returns null instead of throwing when the lookup fails', async () => {
      findOneStub.rejects(new Error('mongo is down'));

      expect(await resolvers.User.presence({ _id: 'user-1' })).to.equal(null);
    });
  });
});

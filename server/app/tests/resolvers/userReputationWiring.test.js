import sinon from 'sinon';
import { expect } from 'chai';
import UserReputationModel from '../../data/resolvers/models/UserReputationModel';
import ReputationCalculator from '../../data/resolvers/utils/reputationCalculator';

jest.mock('../../data/resolvers/subscriptions', () => ({
  pubsub: { publish: jest.fn().mockResolvedValue(undefined) },
  Subscription: {},
}));

import { resolvers } from '../../data/resolvers';

/**
 * Regression guard: User.reputation must be registered in the resolver map.
 * It must also read the stored reputation only; recalculation belongs to the
 * background refresh job, never a profile or user-list query.
 */
describe('resolvers > User reputation field resolver', () => {
  it('exposes User.reputation in the resolver map', () => {
    expect(resolvers.User).to.be.an('object');
    expect(resolvers.User.reputation).to.be.a('function');
  });

  describe('User.reputation', () => {
    let findOneStub;
    let calculateStub;

    beforeEach(() => {
      findOneStub = sinon.stub(UserReputationModel, 'findOne');
      calculateStub = sinon.stub(ReputationCalculator, 'calculateUserReputation');
    });

    afterEach(() => {
      findOneStub.restore();
      calculateStub.restore();
    });

    it('reads the stored reputation without recalculating it', async () => {
      const reputation = {
        _userId: 'user-1',
        overallScore: 124,
        lastCalculated: new Date(0),
      };
      findOneStub.resolves(reputation);

      const result = await resolvers.User.reputation({ _id: 'user-1' });

      expect(result).to.equal(reputation);
      sinon.assert.calledWith(findOneStub, { _userId: 'user-1' });
      sinon.assert.notCalled(calculateStub);
    });

    it('returns null instead of throwing when the lookup fails', async () => {
      findOneStub.rejects(new Error('mongo is down'));

      expect(await resolvers.User.reputation({ _id: 'user-1' })).to.equal(null);
    });
  });
});
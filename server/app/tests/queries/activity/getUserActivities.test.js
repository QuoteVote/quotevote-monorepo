import sinon from 'sinon';
import { expect } from 'chai';
import ActivityModel from '~/resolvers/models/ActivityModel';
import { getUserActivities } from '~/resolvers/queries/activity/getUserActivities';

const context = { user: { _id: 'user-1' } };

describe('Queries > activity > getUserActivities (activityEvent filter)', () => {
  let findStub;

  beforeEach(() => {
    // count() on the first call, the chain on the second.
    findStub = sinon.stub(ActivityModel, 'find');
    findStub.onFirstCall().returns({ count: sinon.stub().resolves(0) });
    findStub.onSecondCall().returns({
      sort: sinon.stub().returnsThis(),
      skip: sinon.stub().returnsThis(),
      limit: sinon.stub().resolves([]),
    });
  });

  afterEach(() => {
    findStub.restore();
  });

  /** The Mongo query built for the given args. */
  const searchArgsFor = async (args) => {
    await getUserActivities()(undefined, { user_id: 'user-1', ...args }, context);
    return findStub.firstCall.args[0];
  };

  it('filters by the requested activity types', async () => {
    const searchArgs = await searchArgsFor({ activityEvent: ['POSTED', 'VOTED'] });

    expect(searchArgs.activityType).to.deep.equal({ $in: ['POSTED', 'VOTED'] });
  });

  // `[]` is truthy, so this previously became $in: [] and matched nothing —
  // an empty filter silently returned an empty feed.
  it('treats an empty list as no filter rather than matching nothing', async () => {
    const searchArgs = await searchArgsFor({ activityEvent: [] });

    expect(searchArgs).to.not.have.property('activityType');
  });

  it('applies no filter when activityEvent is omitted', async () => {
    const searchArgs = await searchArgsFor({});

    expect(searchArgs).to.not.have.property('activityType');
  });

  it('still accepts a JSON-encoded array for older clients', async () => {
    const searchArgs = await searchArgsFor({ activityEvent: '["COMMENTED"]' });

    expect(searchArgs.activityType).to.deep.equal({ $in: ['COMMENTED'] });
  });

  it('treats a JSON-encoded empty array as no filter too', async () => {
    const searchArgs = await searchArgsFor({ activityEvent: '[]' });

    expect(searchArgs).to.not.have.property('activityType');
  });
});

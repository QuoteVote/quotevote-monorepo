import sinon from 'sinon';
import { expect } from 'chai';
import NotificationsModel from '~/resolvers/models/NotificationModel';
import {
  getNotifications,
  resolveLimit,
  DEFAULT_NOTIFICATION_LIMIT,
  MAX_NOTIFICATION_LIMIT,
} from '~/resolvers/queries/notification/getNotifications';

const context = { user: { _id: 'user-1' } };

describe('Queries > notification > resolveLimit', () => {
  it('defaults when no limit is supplied', () => {
    expect(resolveLimit(undefined)).to.equal(DEFAULT_NOTIFICATION_LIMIT);
    expect(resolveLimit(null)).to.equal(DEFAULT_NOTIFICATION_LIMIT);
  });

  it('caps oversized requests', () => {
    expect(resolveLimit(5000)).to.equal(MAX_NOTIFICATION_LIMIT);
  });

  it('passes through a sensible limit', () => {
    expect(resolveLimit(10)).to.equal(10);
  });

  it('falls back for zero, negatives and nonsense', () => {
    expect(resolveLimit(0)).to.equal(DEFAULT_NOTIFICATION_LIMIT);
    expect(resolveLimit(-5)).to.equal(DEFAULT_NOTIFICATION_LIMIT);
    expect(resolveLimit(NaN)).to.equal(DEFAULT_NOTIFICATION_LIMIT);
  });
});

describe('Queries > notification > getNotifications', () => {
  let findStub;
  let chain;

  beforeEach(() => {
    chain = {
      sort: sinon.stub().returnsThis(),
      skip: sinon.stub().returnsThis(),
      limit: sinon.stub().resolves([]),
    };
    findStub = sinon.stub(NotificationsModel, 'find').returns(chain);
  });

  afterEach(() => {
    findStub.restore();
  });

  it('scopes to the authenticated user and defaults to new notifications', async () => {
    await getNotifications()(undefined, {}, context);

    sinon.assert.calledWith(findStub, { userId: 'user-1', status: 'new' });
    sinon.assert.calledWith(chain.limit, DEFAULT_NOTIFICATION_LIMIT);
    sinon.assert.calledWith(chain.skip, 0);
  });

  it('applies limit and offset', async () => {
    await getNotifications()(undefined, { limit: 10, offset: 20 }, context);

    sinon.assert.calledWith(chain.limit, 10);
    sinon.assert.calledWith(chain.skip, 20);
  });

  // Previously every caller fetched the entire history; a client asking for
  // more than the cap must not be able to.
  it('caps an oversized limit', async () => {
    await getNotifications()(undefined, { limit: 100000 }, context);

    sinon.assert.calledWith(chain.limit, MAX_NOTIFICATION_LIMIT);
  });

  it('filters by an explicit status', async () => {
    await getNotifications()(undefined, { status: 'read' }, context);

    sinon.assert.calledWith(findStub, { userId: 'user-1', status: 'read' });
  });

  it('returns every status when status is null', async () => {
    await getNotifications()(undefined, { status: null }, context);

    sinon.assert.calledWith(findStub, { userId: 'user-1' });
  });

  it('ignores a negative offset', async () => {
    await getNotifications()(undefined, { offset: -10 }, context);

    sinon.assert.calledWith(chain.skip, 0);
  });
});

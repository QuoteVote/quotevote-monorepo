import sinon from 'sinon';
import { expect } from 'chai';
import Presence from '~/resolvers/models/PresenceModel';
import { pubsub } from '~/resolvers/subscriptions';
import { heartbeat } from '~/resolvers/mutations/presence/heartbeat';

// resolvers/subscriptions imports GRAPHQL_PORT from server.js, so importing it
// for real pulls the whole server (and a require cycle) into the test. Stub it.
// babel-plugin-jest-hoist lifts this above the imports at transform time.
jest.mock('~/resolvers/subscriptions', () => ({
  pubsub: { publish: jest.fn().mockResolvedValue(undefined) },
}));

const context = { user: { _id: 'user-1' } };

/** Minimal stand-in for a Mongoose presence doc, with a spyable save(). */
const presenceDoc = (overrides = {}) => ({
  userId: { toString: () => 'user-1' },
  status: 'online',
  statusMessage: '',
  preferredStatus: undefined,
  preferredStatusMessage: '',
  lastHeartbeat: new Date('2026-01-01T00:00:00Z'),
  lastSeen: new Date('2026-01-01T00:00:00Z'),
  save: sinon.stub().resolvesThis(),
  ...overrides,
});

describe('Mutations > presence > heartbeat', () => {
  let updateStub;

  beforeEach(() => {
    updateStub = sinon.stub(Presence, 'findOneAndUpdate');
    pubsub.publish.mockClear();
  });

  afterEach(() => {
    updateStub.restore();
  });

  it('requires authentication', async () => {
    try {
      await heartbeat(undefined, {}, {});
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error.message).to.equal('Authentication required');
    }
    sinon.assert.notCalled(updateStub);
  });

  it('returns the current status alongside success and timestamp', async () => {
    const doc = presenceDoc({ status: 'away', statusMessage: 'In a meeting' });
    updateStub.resolves(doc);

    const result = await heartbeat(undefined, {}, context);

    expect(result.success).to.equal(true);
    expect(result.timestamp).to.equal(doc.lastHeartbeat);
    expect(result.status).to.equal('away');
    expect(result.statusMessage).to.equal('In a meeting');
    sinon.assert.notCalled(doc.save);
  });

  // The cleanup job forces stale users offline. A heartbeat proves they are
  // back, so their chosen status should be restored.
  it('restores the preferred status when cleanup marked the user offline', async () => {
    const doc = presenceDoc({
      status: 'offline',
      statusMessage: '',
      preferredStatus: 'dnd',
      preferredStatusMessage: 'Heads down',
    });
    updateStub.resolves(doc);

    const result = await heartbeat(undefined, {}, context);

    expect(result.status).to.equal('dnd');
    expect(result.statusMessage).to.equal('Heads down');
    sinon.assert.calledOnce(doc.save);
    // Subscribers saw the offline event from cleanup; they need the return too.
    expect(pubsub.publish.mock.calls).to.have.lengthOf(1);
  });

  it('does not announce an invisible user coming back', async () => {
    const doc = presenceDoc({ status: 'offline', preferredStatus: 'invisible' });
    updateStub.resolves(doc);

    expect((await heartbeat(undefined, {}, context)).status).to.equal('invisible');
    sinon.assert.calledOnce(doc.save);
    expect(pubsub.publish.mock.calls).to.have.lengthOf(0);
  });

  it('falls back to online when the user never chose a status', async () => {
    const doc = presenceDoc({ status: 'offline', preferredStatus: undefined });
    updateStub.resolves(doc);

    expect((await heartbeat(undefined, {}, context)).status).to.equal('online');
    sinon.assert.calledOnce(doc.save);
  });

  // Choosing 'offline' is intent, not staleness — leave it alone, and do not
  // write on every beat.
  it('leaves a deliberately offline user offline', async () => {
    const doc = presenceDoc({ status: 'offline', preferredStatus: 'offline' });
    updateStub.resolves(doc);

    expect((await heartbeat(undefined, {}, context)).status).to.equal('offline');
    sinon.assert.notCalled(doc.save);
  });
});

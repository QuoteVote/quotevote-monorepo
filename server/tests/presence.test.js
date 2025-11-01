import sinon from 'sinon';
import { expect } from 'chai';
import * as presenceService from '../app/utils/presenceService';
import { pubsub } from '../app/data/resolvers/subscriptions';
import { logger } from '../app/data/utils/logger';

describe('Presence Service', () => {
  let hSetStub;
  let hGetAllStub;
  let expireStub;
  let keysStub;
  let publishStub;
  let pubsubPublishStub;
  let loggerErrorStub;

  beforeEach(() => {
    hSetStub = sinon.stub(presenceService.redisClient, 'hSet');
    hGetAllStub = sinon.stub(presenceService.redisClient, 'hGetAll');
    expireStub = sinon.stub(presenceService.redisClient, 'expire');
    keysStub = sinon.stub(presenceService.redisClient, 'keys');
    publishStub = sinon.stub(presenceService.redisClient, 'publish');
    pubsubPublishStub = sinon.stub(pubsub, 'publish');
    loggerErrorStub = sinon.stub(logger, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('setPresence', () => {
    it('should set presence with TTL and publish update', async () => {
      const userId = 'user123';
      const status = 'online';
      const text = 'Working on project';

      hSetStub.resolves(1);
      expireStub.resolves(1);
      publishStub.resolves(1);

      const result = await presenceService.setPresence(userId, status, text);

      // Verify Redis hSet was called
      sinon.assert.calledWith(
        hSetStub,
        `presence:${userId}`,
        sinon.match({
          status,
          text,
          lastSeen: sinon.match.string,
        }),
      );

      // Verify TTL was set (120 seconds = 2 minutes)
      sinon.assert.calledWith(
        expireStub,
        `presence:${userId}`,
        120,
      );

      // Verify Redis publish was called
      sinon.assert.calledWith(
        publishStub,
        'presence:updates',
        sinon.match.string,
      );

      // Verify pubsub publish was called
      sinon.assert.calledWith(
        pubsubPublishStub,
        sinon.match.string,
        sinon.match({
          presenceUpdates: sinon.match({
            userId,
            status,
            text,
            lastSeen: sinon.match.string,
          }),
        }),
      );

      // Verify result
      expect(result).to.deep.include({
        userId,
        status,
        text,
      });
      expect(result.lastSeen).to.be.a('string');
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Redis error');
      hSetStub.rejects(error);
      loggerErrorStub.returns();

      try {
        await presenceService.setPresence('user123', 'online', 'test');
        // If we reach here, the test should fail
        expect.fail('Expected setPresence to throw an error');
      } catch (err) {
        expect(err).to.equal(error);
      }

      sinon.assert.calledWith(loggerErrorStub, 'Error setting presence', error);
    });
  });

  describe('getPresence', () => {
    it('should retrieve presence data for a user', async () => {
      const userId = 'user123';
      const mockPresenceData = {
        status: 'online',
        text: 'Working',
        lastSeen: new Date().toISOString(),
      };

      hGetAllStub.withArgs(`presence:${userId}`).resolves(mockPresenceData);

      const result = await presenceService.getPresence(userId);

      sinon.assert.calledWith(hGetAllStub, `presence:${userId}`);
      expect(result).to.deep.include({
        ...mockPresenceData,
        userId,
      });
    });

    it('should return null if no presence data found', async () => {
      hGetAllStub.withArgs('presence:nonexistent').resolves({});

      const result = await presenceService.getPresence('nonexistent');

      expect(result).to.equal(null);
    });
  });

  describe('presenceSet', () => {
    it('should set presence for current user', async () => {
      const userId = 'user123';
      const status = 'away';
      const text = 'In a meeting';

      hSetStub.resolves(1);
      expireStub.resolves(1);
      publishStub.resolves(1);

      const result = await presenceService.presenceSet(userId, status, text);

      sinon.assert.calledWith(
        hSetStub,
        `presence:${userId}`,
        sinon.match({
          userId,
          status,
          text,
          lastSeen: sinon.match.string,
        }),
      );

      expect(result).to.deep.include({
        userId,
        status,
        text,
      });
    });
  });

  describe('presenceOnlineUsers', () => {
    it('should return all online users', async () => {
      const mockKeys = ['presence:user1', 'presence:user2', 'presence:user3'];
      const mockPresenceData = {
        status: 'online',
        text: 'Available',
        lastSeen: new Date().toISOString(),
      };

      keysStub.withArgs('presence:*').resolves(mockKeys);
      hGetAllStub.resolves(mockPresenceData);

      const result = await presenceService.presenceOnlineUsers();

      sinon.assert.calledWith(keysStub, 'presence:*');
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.deep.include({
        ...mockPresenceData,
        userId: 'user1',
      });
    });

    it('should filter out null results', async () => {
      const mockKeys = ['presence:user1', 'presence:user2'];

      keysStub.withArgs('presence:*').resolves(mockKeys);
      hGetAllStub.onFirstCall().resolves({ status: 'online', lastSeen: new Date().toISOString() });
      hGetAllStub.onSecondCall().resolves({});

      const result = await presenceService.presenceOnlineUsers();

      expect(result).to.have.lengthOf(1);
    });

    it('should return empty array if no users online', async () => {
      keysStub.withArgs('presence:*').resolves([]);

      const result = await presenceService.presenceOnlineUsers();

      expect(result).to.deep.equal([]);
    });
  });

  describe('TTL Expiry', () => {
    it('should verify TTL is set to 2 minutes (120 seconds)', async () => {
      hSetStub.resolves(1);
      expireStub.resolves(1);
      publishStub.resolves(1);

      await presenceService.setPresence('user123', 'online', 'test');

      sinon.assert.calledWith(
        expireStub,
        'presence:user123',
        120,
      );
    });
  });

  describe('Subscription Events', () => {
    it('should publish presence update event when setting presence', async () => {
      const userId = 'user123';
      const status = 'online';
      const text = 'Available';

      hSetStub.resolves(1);
      expireStub.resolves(1);
      publishStub.resolves(1);

      await presenceService.setPresence(userId, status, text);

      sinon.assert.calledWith(
        pubsubPublishStub,
        sinon.match.string,
        sinon.match({
          presenceUpdates: sinon.match({
            userId,
            status,
            text,
          }),
        }),
      );
    });

    it('should publish presence update event when using presenceSet', async () => {
      const userId = 'user456';
      const status = 'away';
      const text = 'Busy';

      hSetStub.resolves(1);
      expireStub.resolves(1);
      publishStub.resolves(1);

      await presenceService.presenceSet(userId, status, text);

      sinon.assert.calledWith(
        pubsubPublishStub,
        sinon.match.string,
        sinon.match({
          presenceUpdates: sinon.match({
            userId,
            status,
            text,
          }),
        }),
      );
    });
  });
});

import sinon from 'sinon';
import { expect } from 'chai';
import * as presenceService from '../../app/utils/presenceService';

describe('Presence Feature Integration Tests', () => {
  let redisClientStub;

  beforeEach(() => {
    // Stub Redis client methods
    redisClientStub = {
      hSet: sinon.stub().resolves(1),
      hGetAll: sinon.stub().resolves({}),
      expire: sinon.stub().resolves(1),
      keys: sinon.stub().resolves([]),
      publish: sinon.stub().resolves(1),
    };

    // Replace the redisClient in presenceService
    sinon.stub(presenceService, 'redisClient').value(redisClientStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('End-to-End Presence Flow', () => {
    it('should set presence, retrieve it, and verify TTL', async () => {
      const userId = 'test-user-123';
      const status = 'online';
      const text = 'Working on tests';

      // Mock Redis responses
      redisClientStub.hSet.resolves(1);
      redisClientStub.expire.resolves(1);
      redisClientStub.publish.resolves(1);

      // Set presence
      const setResult = await presenceService.setPresence(userId, status, text);

      // Verify set operation
      expect(setResult).to.include({
        userId,
        status,
        text,
      });
      expect(setResult.lastSeen).to.be.a('string');

      // Verify Redis hSet was called
      sinon.assert.calledWith(
        redisClientStub.hSet,
        `presence:${userId}`,
        sinon.match({
          status,
          text,
          lastSeen: sinon.match.string,
        })
      );

      // Verify TTL was set to 120 seconds
      sinon.assert.calledWith(
        redisClientStub.expire,
        `presence:${userId}`,
        120
      );

      // Verify publish was called
      sinon.assert.calledWith(
        redisClientStub.publish,
        'presence:updates',
        sinon.match.string
      );
    });

    it('should retrieve all online users', async () => {
      const mockKeys = [
        'presence:user1',
        'presence:user2',
        'presence:user3',
      ];

      const mockPresenceData = {
        status: 'online',
        text: 'Available',
        lastSeen: new Date().toISOString(),
      };

      redisClientStub.keys.withArgs('presence:*').resolves(mockKeys);
      redisClientStub.hGetAll.resolves(mockPresenceData);

      const result = await presenceService.presenceOnlineUsers();

      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.include({
        ...mockPresenceData,
        userId: 'user1',
      });

      sinon.assert.calledWith(redisClientStub.keys, 'presence:*');
      sinon.assert.callCount(redisClientStub.hGetAll, 3);
    });
  });
});

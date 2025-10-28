import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';

// Mock Redis before importing chat modules
const mockRedisClient = {
  publish: sinon.stub().resolves(1),
  connect: sinon.stub().resolves(),
  on: sinon.stub(),
};

// Mock the redis module
import { createClient } from 'redis';
sinon.stub({ createClient }, 'createClient').returns(mockRedisClient);

import ConversationModel from '../app/data/resolvers/models/ConversationModel';
import ConversationMessageModel from '../app/data/resolvers/models/ConversationMessageModel';
import * as chatQueries from '../app/data/resolvers/queries/chat';
import * as chatMutations from '../app/data/resolvers/mutations/chat';

describe('Chat Resolvers', () => {
  let findStub;
  let findByIdStub;
  let findOneStub;
  let saveStub;
  let redisPublishStub;
  let pubsubPublishStub;

  const mockUserId = new mongoose.Types.ObjectId();
  const mockOtherUserId = new mongoose.Types.ObjectId();
  const mockConversationId = new mongoose.Types.ObjectId();

  const mockContext = {
    user: {
      _id: mockUserId,
    },
  };

  beforeEach(() => {
    findStub = sinon.stub(ConversationModel, 'find');
    findByIdStub = sinon.stub(ConversationModel, 'findById');
    findOneStub = sinon.stub(ConversationModel, 'findOne');
    saveStub = sinon.stub(ConversationModel.prototype, 'save');
    
    // Stub message save
    sinon.stub(ConversationMessageModel.prototype, 'save');
    
    // Stub Redis publish
    redisPublishStub = mockRedisClient.publish;
    redisPublishStub.resetHistory();
    redisPublishStub.resolves(1);
    
    pubsubPublishStub = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Query: conversations', () => {
    it('should require authentication', async () => {
      const resolver = chatQueries.getConversations();

      try {
        await resolver(null, {}, {});
        expect.fail('Should have thrown authentication error');
      } catch (error) {
        expect(error.message).to.equal('Authentication required');
      }
    });

    it('should return conversations for authenticated user', async () => {
      const mockConversations = [
        {
          _id: mockConversationId,
          participantIds: [mockUserId, mockOtherUserId],
          isRoom: false,
          createdAt: new Date(),
        },
      ];

      findStub.returns({
        sort: sinon.stub().resolves(mockConversations),
      });

      const resolver = chatQueries.getConversations();
      const result = await resolver(null, {}, mockContext);

      expect(result).to.have.lengthOf(1);
      expect(result[0].id).to.equal(mockConversationId.toString());
      expect(result[0].participantIds).to.have.lengthOf(2);
      sinon.assert.calledWith(findStub, { participantIds: mockUserId });
    });
  });

  describe('Query: conversation', () => {
    it('should require authentication', async () => {
      const resolver = chatQueries.getConversation();

      try {
        await resolver(null, { id: mockConversationId.toString() }, {});
        expect.fail('Should have thrown authentication error');
      } catch (error) {
        expect(error.message).to.equal('Authentication required');
      }
    });

    it('should return conversation if user is participant', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
        createdAt: new Date(),
      };

      findByIdStub.resolves(mockConversation);

      const resolver = chatQueries.getConversation();
      const result = await resolver(
        null,
        { id: mockConversationId.toString() },
        mockContext
      );

      expect(result.id).to.equal(mockConversationId.toString());
      expect(result.participantIds).to.have.lengthOf(2);
    });

    it('should throw error if user is not participant', async () => {
      const otherUserId = new mongoose.Types.ObjectId();
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockOtherUserId, otherUserId],
        isRoom: false,
        createdAt: new Date(),
      };

      findByIdStub.resolves(mockConversation);

      const resolver = chatQueries.getConversation();

      try {
        await resolver(
          null,
          { id: mockConversationId.toString() },
          mockContext
        );
        expect.fail('Should have thrown authorization error');
      } catch (error) {
        expect(error.message).to.equal('Not authorized to view this conversation');
      }
    });

    it('should return null if conversation not found', async () => {
      findByIdStub.resolves(null);

      const resolver = chatQueries.getConversation();
      const result = await resolver(
        null,
        { id: mockConversationId.toString() },
        mockContext
      );

      expect(result).to.be.null;
    });
  });

  describe('Mutation: convEnsureDirect', () => {
    it('should require authentication', async () => {
      const resolver = chatMutations.convEnsureDirect();

      try {
        await resolver(null, { otherUserId: mockOtherUserId.toString() }, {});
        expect.fail('Should have thrown authentication error');
      } catch (error) {
        expect(error.message).to.equal('Authentication required');
      }
    });

    it('should return existing conversation if it exists', async () => {
      const existingConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
        createdAt: new Date(),
      };

      findOneStub.resolves(existingConversation);

      const resolver = chatMutations.convEnsureDirect();
      const result = await resolver(
        null,
        { otherUserId: mockOtherUserId.toString() },
        mockContext
      );

      expect(result.id).to.equal(mockConversationId.toString());
      expect(result.isRoom).to.be.false;
      sinon.assert.calledOnce(findOneStub);
      sinon.assert.notCalled(saveStub);
    });

    it('should create new conversation if it does not exist', async () => {
      findOneStub.resolves(null);

      const newConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
        createdAt: new Date(),
      };

      saveStub.resolves(newConversation);

      const resolver = chatMutations.convEnsureDirect();
      const result = await resolver(
        null,
        { otherUserId: mockOtherUserId.toString() },
        mockContext
      );

      expect(result.id).to.equal(mockConversationId.toString());
      expect(result.participantIds).to.have.lengthOf(2);
      sinon.assert.calledOnce(findOneStub);
      sinon.assert.calledOnce(saveStub);
    });

    it('should not allow conversation with self', async () => {
      const resolver = chatMutations.convEnsureDirect();

      try {
        await resolver(
          null,
          { otherUserId: mockUserId.toString() },
          mockContext
        );
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Cannot create conversation with yourself');
      }
    });
  });

  describe('Mutation: msgSend', () => {
    it('should require authentication', async () => {
      const resolver = chatMutations.msgSend();

      try {
        await resolver(
          null,
          { conversationId: mockConversationId.toString(), body: 'Test' },
          {}
        );
        expect.fail('Should have thrown authentication error');
      } catch (error) {
        expect(error.message).to.equal('Authentication required');
      }
    });

    it('should send message if user is participant', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
      };

      const mockMessageId = new mongoose.Types.ObjectId();
      const mockMessage = {
        _id: mockMessageId,
        conversationId: mockConversationId,
        authorId: mockUserId,
        body: 'Hello!',
        createdAt: new Date(),
      };

      findByIdStub.resolves(mockConversation);
      ConversationMessageModel.prototype.save.resolves(mockMessage);
      redisPublishStub.resolves(1);

      const resolver = chatMutations.msgSend();
      const result = await resolver(
        null,
        { conversationId: mockConversationId.toString(), body: 'Hello!' },
        mockContext
      );

      expect(result.id).to.equal(mockMessageId.toString());
      expect(result.body).to.equal('Hello!');
      expect(result.authorId).to.equal(mockUserId.toString());

      // Verify Redis publish was called
      sinon.assert.calledWith(
        redisPublishStub,
        `msgNew:${mockConversationId}`,
        sinon.match.string
      );
    });

    it('should throw error if conversation not found', async () => {
      findByIdStub.resolves(null);

      const resolver = chatMutations.msgSend();

      try {
        await resolver(
          null,
          { conversationId: mockConversationId.toString(), body: 'Test' },
          mockContext
        );
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Conversation not found');
      }
    });

    it('should throw error if user is not participant', async () => {
      const otherUserId = new mongoose.Types.ObjectId();
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockOtherUserId, otherUserId],
        isRoom: false,
      };

      findByIdStub.resolves(mockConversation);

      const resolver = chatMutations.msgSend();

      try {
        await resolver(
          null,
          { conversationId: mockConversationId.toString(), body: 'Test' },
          mockContext
        );
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal(
          'Not authorized to send messages in this conversation'
        );
      }
    });
  });

  describe('Message Storage and Subscription', () => {
    it('should store message in database', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
      };

      const mockMessageId = new mongoose.Types.ObjectId();
      const mockMessage = {
        _id: mockMessageId,
        conversationId: mockConversationId,
        authorId: mockUserId,
        body: 'Test message',
        createdAt: new Date(),
      };

      findByIdStub.resolves(mockConversation);
      ConversationMessageModel.prototype.save.resolves(mockMessage);
      redisPublishStub.resolves(1);

      const resolver = chatMutations.msgSend();
      await resolver(
        null,
        { conversationId: mockConversationId.toString(), body: 'Test message' },
        mockContext
      );

      // Verify message was saved
      sinon.assert.calledOnce(ConversationMessageModel.prototype.save);
    });

    it('should publish to Redis channel for subscription', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
      };

      const mockMessageId = new mongoose.Types.ObjectId();
      const mockMessage = {
        _id: mockMessageId,
        conversationId: mockConversationId,
        authorId: mockUserId,
        body: 'Test message',
        createdAt: new Date(),
      };

      findByIdStub.resolves(mockConversation);
      ConversationMessageModel.prototype.save.resolves(mockMessage);
      redisPublishStub.resolves(1);

      const resolver = chatMutations.msgSend();
      await resolver(
        null,
        { conversationId: mockConversationId.toString(), body: 'Test message' },
        mockContext
      );

      // Verify Redis publish was called with correct channel
      sinon.assert.calledWith(
        redisPublishStub,
        `msgNew:${mockConversationId}`,
        sinon.match.string
      );

      // Verify the published message contains correct data
      const publishedData = JSON.parse(redisPublishStub.firstCall.args[1]);
      expect(publishedData.body).to.equal('Test message');
      expect(publishedData.conversationId).to.equal(mockConversationId.toString());
    });
  });
});

import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';

// Mock Redis before importing chat modules
const mockRedisClient = {
  publish: sinon.stub().resolves(1),
  connect: sinon.stub().resolves(),
  on: sinon.stub(),
  subscribe: sinon.stub(),
  unsubscribe: sinon.stub(),
};

// Mock the redis module
import { createClient } from 'redis';
sinon.stub({ createClient }, 'createClient').returns(mockRedisClient);

import ConversationModel from '../app/data/resolvers/models/ConversationModel';
import ConversationMessageModel from '../app/data/resolvers/models/ConversationMessageModel';
import ReceiptModel from '../app/data/resolvers/models/ReceiptModel';
import * as chatMutations from '../app/data/resolvers/mutations/chat';

describe('Chat Typing and Receipt Resolvers', () => {
  let findStub;
  let findByIdStub;
  let findOneStub;
  let saveStub;
  let redisPublishStub;

  const mockUserId = new mongoose.Types.ObjectId();
  const mockOtherUserId = new mongoose.Types.ObjectId();
  const mockConversationId = new mongoose.Types.ObjectId();
  const mockMessageId = new mongoose.Types.ObjectId();

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
    
    // Stub Receipt save
    sinon.stub(ReceiptModel.prototype, 'save');
    sinon.stub(ReceiptModel, 'findOne');
    
    // Stub Redis publish
    redisPublishStub = mockRedisClient.publish;
    redisPublishStub.resetHistory();
    redisPublishStub.resolves(1);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Mutation: msgTyping', () => {
    it('should require authentication', async () => {
      const resolver = chatMutations.msgTyping();

      try {
        await resolver(null, { 
          conversationId: mockConversationId.toString(), 
          isTyping: true 
        }, {});
        expect.fail('Should have thrown authentication error');
      } catch (error) {
        expect(error.message).to.equal('Authentication required');
      }
    });

    it('should throw error if conversation not found', async () => {
      findByIdStub.resolves(null);

      const resolver = chatMutations.msgTyping();

      try {
        await resolver(null, { 
          conversationId: mockConversationId.toString(), 
          isTyping: true 
        }, mockContext);
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

      const resolver = chatMutations.msgTyping();

      try {
        await resolver(null, { 
          conversationId: mockConversationId.toString(), 
          isTyping: true 
        }, mockContext);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal(
          'Not authorized to send typing indicator in this conversation'
        );
      }
    });

    it('should publish typing indicator to Redis channel', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
      };

      findByIdStub.resolves(mockConversation);
      redisPublishStub.resolves(1);

      const resolver = chatMutations.msgTyping();
      const result = await resolver(null, { 
        conversationId: mockConversationId.toString(), 
        isTyping: true 
      }, mockContext);

      expect(result).to.be.true;

      // Verify Redis publish was called with correct channel
      sinon.assert.calledWith(
        redisPublishStub,
        `typing:${mockConversationId}`,
        sinon.match.string
      );

      // Verify the published message contains correct data
      const publishedData = JSON.parse(redisPublishStub.firstCall.args[1]);
      expect(publishedData.conversationId).to.equal(mockConversationId.toString());
      expect(publishedData.userId).to.equal(mockUserId.toString());
      expect(publishedData.isTyping).to.be.true;
      expect(publishedData.lastUpdated).to.be.a('string');
    });

    it('should handle typing false correctly', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
      };

      findByIdStub.resolves(mockConversation);
      redisPublishStub.resolves(1);

      const resolver = chatMutations.msgTyping();
      const result = await resolver(null, { 
        conversationId: mockConversationId.toString(), 
        isTyping: false 
      }, mockContext);

      expect(result).to.be.true;

      // Verify the published message contains correct data
      const publishedData = JSON.parse(redisPublishStub.firstCall.args[1]);
      expect(publishedData.isTyping).to.be.false;
    });
  });

  describe('Mutation: msgRead', () => {
    it('should require authentication', async () => {
      const resolver = chatMutations.msgRead();

      try {
        await resolver(null, { 
          conversationId: mockConversationId.toString(), 
          messageId: mockMessageId.toString() 
        }, {});
        expect.fail('Should have thrown authentication error');
      } catch (error) {
        expect(error.message).to.equal('Authentication required');
      }
    });

    it('should throw error if conversation not found', async () => {
      findByIdStub.resolves(null);

      const resolver = chatMutations.msgRead();

      try {
        await resolver(null, { 
          conversationId: mockConversationId.toString(), 
          messageId: mockMessageId.toString() 
        }, mockContext);
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

      const resolver = chatMutations.msgRead();

      try {
        await resolver(null, { 
          conversationId: mockConversationId.toString(), 
          messageId: mockMessageId.toString() 
        }, mockContext);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal(
          'Not authorized to mark messages as read in this conversation'
        );
      }
    });

    it('should throw error if message not found', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
      };

      findByIdStub.resolves(mockConversation);
      findOneStub.resolves(null); // Message not found

      const resolver = chatMutations.msgRead();

      try {
        await resolver(null, { 
          conversationId: mockConversationId.toString(), 
          messageId: mockMessageId.toString() 
        }, mockContext);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Message not found in this conversation');
      }
    });

    it('should create new receipt if it does not exist', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
      };

      const mockMessage = {
        _id: mockMessageId,
        conversationId: mockConversationId,
        authorId: mockOtherUserId,
        body: 'Test message',
        createdAt: new Date(),
      };

      const mockReceipt = {
        _id: new mongoose.Types.ObjectId(),
        conversationId: mockConversationId,
        userId: mockUserId,
        lastSeenMessageId: mockMessageId,
        lastSeenAt: new Date(),
      };

      findByIdStub.resolves(mockConversation);
      findOneStub.onFirstCall().resolves(mockMessage); // Message found
      findOneStub.onSecondCall().resolves(null); // Receipt not found
      ReceiptModel.prototype.save.resolves(mockReceipt);
      redisPublishStub.resolves(1);

      const resolver = chatMutations.msgRead();
      const result = await resolver(null, { 
        conversationId: mockConversationId.toString(), 
        messageId: mockMessageId.toString() 
      }, mockContext);

      expect(result).to.be.true;

      // Verify receipt was saved
      sinon.assert.calledOnce(ReceiptModel.prototype.save);

      // Verify Redis publish was called
      sinon.assert.calledWith(
        redisPublishStub,
        `receipt:${mockConversationId}`,
        sinon.match.string
      );

      // Verify the published message contains correct data
      const publishedData = JSON.parse(redisPublishStub.firstCall.args[1]);
      expect(publishedData.conversationId).to.equal(mockConversationId.toString());
      expect(publishedData.userId).to.equal(mockUserId.toString());
      expect(publishedData.lastSeenMessageId).to.equal(mockMessageId.toString());
      expect(publishedData.lastSeenAt).to.be.a('string');
    });

    it('should update existing receipt if it exists', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
      };

      const mockMessage = {
        _id: mockMessageId,
        conversationId: mockConversationId,
        authorId: mockOtherUserId,
        body: 'Test message',
        createdAt: new Date(),
      };

      const existingReceipt = {
        _id: new mongoose.Types.ObjectId(),
        conversationId: mockConversationId,
        userId: mockUserId,
        lastSeenMessageId: new mongoose.Types.ObjectId(),
        lastSeenAt: new Date(Date.now() - 10000),
        save: sinon.stub().resolves({
          _id: new mongoose.Types.ObjectId(),
          conversationId: mockConversationId,
          userId: mockUserId,
          lastSeenMessageId: mockMessageId,
          lastSeenAt: new Date(),
        })
      };

      const mockReceipt = {
        _id: new mongoose.Types.ObjectId(),
        conversationId: mockConversationId,
        userId: mockUserId,
        lastSeenMessageId: mockMessageId,
        lastSeenAt: new Date(),
      };

      findByIdStub.resolves(mockConversation);
      findOneStub.onFirstCall().resolves(mockMessage); // Message found
      findOneStub.onSecondCall().resolves(existingReceipt); // Receipt found
      redisPublishStub.resolves(1);

      const resolver = chatMutations.msgRead();
      const result = await resolver(null, { 
        conversationId: mockConversationId.toString(), 
        messageId: mockMessageId.toString() 
      }, mockContext);

      expect(result).to.be.true;

      // Verify receipt was saved (updated)
      sinon.assert.calledOnce(existingReceipt.save);

      // Verify Redis publish was called
      sinon.assert.calledWith(
        redisPublishStub,
        `receipt:${mockConversationId}`,
        sinon.match.string
      );

      // Verify the published message contains correct data
      const publishedData = JSON.parse(redisPublishStub.firstCall.args[1]);
      expect(publishedData.conversationId).to.equal(mockConversationId.toString());
      expect(publishedData.userId).to.equal(mockUserId.toString());
      expect(publishedData.lastSeenMessageId).to.equal(mockMessageId.toString());
      expect(publishedData.lastSeenAt).to.be.a('string');
    });
  });

  describe('Error Handling', () => {
    it('should handle Redis publish errors gracefully', async () => {
      const mockConversation = {
        _id: mockConversationId,
        participantIds: [mockUserId, mockOtherUserId],
        isRoom: false,
      };

      findByIdStub.resolves(mockConversation);
      redisPublishStub.rejects(new Error('Redis error'));

      const resolver = chatMutations.msgTyping();
      
      // Should not throw error even if Redis publish fails
      const result = await resolver(null, { 
        conversationId: mockConversationId.toString(), 
        isTyping: true 
      }, mockContext);

      expect(result).to.be.true;
    });

    it('should handle database errors appropriately', async () => {
      findByIdStub.rejects(new Error('Database error'));

      const resolver = chatMutations.msgTyping();

      try {
        await resolver(null, { 
          conversationId: mockConversationId.toString(), 
          isTyping: true 
        }, mockContext);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.equal('Database error');
      }
    });
  });
});
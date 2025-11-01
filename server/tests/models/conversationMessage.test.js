import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';
import ConversationMessageModel from '../../app/data/resolvers/models/ConversationMessageModel';

describe('ConversationMessageModel', () => {
  let saveStub;
  let findStub;
  let findOneStub;
  let updateOneStub;

  beforeEach(() => {
    saveStub = sinon.stub(ConversationMessageModel.prototype, 'save');
    findStub = sinon.stub(ConversationMessageModel, 'find');
    findOneStub = sinon.stub(ConversationMessageModel, 'findOne');
    updateOneStub = sinon.stub(ConversationMessageModel, 'updateOne');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Schema Validation', () => {
    it('should create a message with required fields', async () => {
      const messageData = {
        conversationId: new mongoose.Types.ObjectId(),
        authorId: new mongoose.Types.ObjectId(),
        body: 'Hello, this is a test message',
        createdAt: new Date(),
      };

      const message = new ConversationMessageModel(messageData);
      saveStub.resolves(message);

      const result = await message.save();

      expect(result.conversationId).to.exist;
      expect(result.authorId).to.exist;
      expect(result.body).to.equal('Hello, this is a test message');
      expect(result.createdAt).to.be.an.instanceof(Date);
      sinon.assert.calledOnce(saveStub);
    });

    it('should create a message without editedAt initially', async () => {
      const messageData = {
        conversationId: new mongoose.Types.ObjectId(),
        authorId: new mongoose.Types.ObjectId(),
        body: 'Test message',
        createdAt: new Date(),
      };

      const message = new ConversationMessageModel(messageData);
      saveStub.resolves(message);

      const result = await message.save();

      expect(result.editedAt).to.be.undefined;
      sinon.assert.calledOnce(saveStub);
    });

    it('should set createdAt to current date by default', () => {
      const message = new ConversationMessageModel({
        conversationId: new mongoose.Types.ObjectId(),
        authorId: new mongoose.Types.ObjectId(),
        body: 'Test message',
      });

      expect(message.createdAt).to.be.an.instanceof(Date);
    });

    it('should allow editedAt to be set', async () => {
      const editedDate = new Date();
      const messageData = {
        conversationId: new mongoose.Types.ObjectId(),
        authorId: new mongoose.Types.ObjectId(),
        body: 'Edited message',
        createdAt: new Date(),
        editedAt: editedDate,
      };

      const message = new ConversationMessageModel(messageData);
      saveStub.resolves(message);

      const result = await message.save();

      expect(result.editedAt).to.deep.equal(editedDate);
      sinon.assert.calledOnce(saveStub);
    });
  });

  describe('Queries', () => {
    it('should find messages by conversationId', async () => {
      const conversationId = new mongoose.Types.ObjectId();
      const mockMessages = [
        {
          _id: new mongoose.Types.ObjectId(),
          conversationId,
          authorId: new mongoose.Types.ObjectId(),
          body: 'Message 1',
          createdAt: new Date(),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          conversationId,
          authorId: new mongoose.Types.ObjectId(),
          body: 'Message 2',
          createdAt: new Date(),
        },
      ];

      findStub.resolves(mockMessages);

      const result = await ConversationMessageModel.find({
        conversationId,
      });

      expect(result).to.have.lengthOf(2);
      sinon.assert.calledWith(findStub, { conversationId });
    });

    it('should find messages by authorId', async () => {
      const authorId = new mongoose.Types.ObjectId();
      const mockMessages = [
        {
          _id: new mongoose.Types.ObjectId(),
          conversationId: new mongoose.Types.ObjectId(),
          authorId,
          body: 'My message',
          createdAt: new Date(),
        },
      ];

      findStub.resolves(mockMessages);

      const result = await ConversationMessageModel.find({ authorId });

      expect(result).to.have.lengthOf(1);
      expect(result[0].authorId).to.deep.equal(authorId);
      sinon.assert.calledWith(findStub, { authorId });
    });

    it('should find a specific message by ID', async () => {
      const messageId = new mongoose.Types.ObjectId();
      const mockMessage = {
        _id: messageId,
        conversationId: new mongoose.Types.ObjectId(),
        authorId: new mongoose.Types.ObjectId(),
        body: 'Specific message',
        createdAt: new Date(),
      };

      findOneStub.resolves(mockMessage);

      const result = await ConversationMessageModel.findOne({ _id: messageId });

      expect(result._id).to.deep.equal(messageId);
      sinon.assert.calledWith(findOneStub, { _id: messageId });
    });
  });

  describe('Updates', () => {
    it('should update message body and set editedAt', async () => {
      const messageId = new mongoose.Types.ObjectId();
      const editedDate = new Date();

      updateOneStub.resolves({ nModified: 1 });

      const result = await ConversationMessageModel.updateOne(
        { _id: messageId },
        {
          $set: {
            body: 'Updated message body',
            editedAt: editedDate,
          },
        }
      );

      expect(result.nModified).to.equal(1);
      sinon.assert.calledWith(
        updateOneStub,
        { _id: messageId },
        {
          $set: {
            body: 'Updated message body',
            editedAt: editedDate,
          },
        }
      );
    });
  });

  describe('Indexes', () => {
    it('should have compound index on conversationId and createdAt', () => {
      const indexes = ConversationMessageModel.schema.indexes();
      const compoundIndex = indexes.find(
        (index) =>
          index[0].conversationId === 1 && index[0].createdAt === -1
      );

      expect(compoundIndex).to.exist;
    });

    it('should have index on conversationId', () => {
      const indexes = ConversationMessageModel.schema.indexes();
      const conversationIndex = indexes.find(
        (index) => index[0].conversationId === 1
      );

      expect(conversationIndex).to.exist;
    });
  });

  describe('References', () => {
    it('should have ref to Conversation model', () => {
      const conversationIdPath = ConversationMessageModel.schema.path('conversationId');
      expect(conversationIdPath.options.ref).to.equal('Conversation');
    });

    it('should have ref to User model', () => {
      const authorIdPath = ConversationMessageModel.schema.path('authorId');
      expect(authorIdPath.options.ref).to.equal('User');
    });
  });
});

import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';
import ConversationModel from '../../app/data/resolvers/models/ConversationModel';

describe('ConversationModel', () => {
  let saveStub;
  let findStub;
  let findOneStub;

  beforeEach(() => {
    saveStub = sinon.stub(ConversationModel.prototype, 'save');
    findStub = sinon.stub(ConversationModel, 'find');
    findOneStub = sinon.stub(ConversationModel, 'findOne');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Schema Validation', () => {
    it('should create a conversation with required fields', async () => {
      const conversationData = {
        participantIds: [
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId(),
        ],
        isRoom: false,
        createdAt: new Date(),
      };

      const conversation = new ConversationModel(conversationData);
      saveStub.resolves(conversation);

      const result = await conversation.save();

      expect(result.participantIds).to.have.lengthOf(2);
      expect(result.isRoom).to.equal(false);
      expect(result.createdAt).to.be.an.instanceof(Date);
      sinon.assert.calledOnce(saveStub);
    });

    it('should create a conversation with optional postId', async () => {
      const postId = new mongoose.Types.ObjectId();
      const conversationData = {
        participantIds: [
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId(),
        ],
        isRoom: true,
        postId,
        createdAt: new Date(),
      };

      const conversation = new ConversationModel(conversationData);
      saveStub.resolves(conversation);

      const result = await conversation.save();

      expect(result.postId).to.deep.equal(postId);
      expect(result.isRoom).to.equal(true);
      sinon.assert.calledOnce(saveStub);
    });

    it('should default isRoom to false', () => {
      const conversation = new ConversationModel({
        participantIds: [new mongoose.Types.ObjectId()],
      });

      expect(conversation.isRoom).to.equal(false);
    });

    it('should set createdAt to current date by default', () => {
      const conversation = new ConversationModel({
        participantIds: [new mongoose.Types.ObjectId()],
        isRoom: false,
      });

      expect(conversation.createdAt).to.be.an.instanceof(Date);
    });
  });

  describe('Queries', () => {
    it('should find conversations by participantId', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockConversations = [
        {
          _id: new mongoose.Types.ObjectId(),
          participantIds: [userId, new mongoose.Types.ObjectId()],
          isRoom: false,
          createdAt: new Date(),
        },
      ];

      findStub.resolves(mockConversations);

      const result = await ConversationModel.find({
        participantIds: userId,
      });

      expect(result).to.have.lengthOf(1);
      sinon.assert.calledWith(findStub, { participantIds: userId });
    });

    it('should find a specific conversation by ID', async () => {
      const conversationId = new mongoose.Types.ObjectId();
      const mockConversation = {
        _id: conversationId,
        participantIds: [
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId(),
        ],
        isRoom: false,
        createdAt: new Date(),
      };

      findOneStub.resolves(mockConversation);

      const result = await ConversationModel.findOne({ _id: conversationId });

      expect(result._id).to.deep.equal(conversationId);
      sinon.assert.calledWith(findOneStub, { _id: conversationId });
    });

    it('should find room conversations', async () => {
      const mockRooms = [
        {
          _id: new mongoose.Types.ObjectId(),
          participantIds: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
          ],
          isRoom: true,
          createdAt: new Date(),
        },
      ];

      findStub.resolves(mockRooms);

      const result = await ConversationModel.find({ isRoom: true });

      expect(result).to.have.lengthOf(1);
      expect(result[0].isRoom).to.equal(true);
      sinon.assert.calledWith(findStub, { isRoom: true });
    });
  });

  describe('Indexes', () => {
    it('should have compound index on participantIds and createdAt', () => {
      const indexes = ConversationModel.schema.indexes();
      const compoundIndex = indexes.find(
        (index) =>
          index[0].participantIds === 1 && index[0].createdAt === -1
      );

      expect(compoundIndex).to.exist;
    });

    it('should have index on participantIds', () => {
      const indexes = ConversationModel.schema.indexes();
      const participantIndex = indexes.find(
        (index) => index[0].participantIds === 1
      );

      expect(participantIndex).to.exist;
    });
  });
});

import sinon from 'sinon';
import { expect } from 'chai';
import CommentsModel from '~/resolvers/models/CommentModel';
import { updateComment } from '~/resolvers/mutations/comment/updateComment';

const owner = { user: { _id: 'user-1' } };
const stranger = { user: { _id: 'user-2' } };
const admin = { user: { _id: 'user-2', admin: true } };

const existing = (overrides = {}) => ({
  _id: 'comment-1',
  userId: { toString: () => 'user-1' },
  content: 'original',
  deleted: false,
  ...overrides,
});

describe('Mutations > comment > updateComment', () => {
  let findByIdStub;
  let updateStub;

  beforeEach(() => {
    findByIdStub = sinon.stub(CommentsModel, 'findById');
    updateStub = sinon.stub(CommentsModel, 'findByIdAndUpdate').resolves({ _id: 'comment-1' });
  });

  afterEach(() => {
    findByIdStub.restore();
    updateStub.restore();
  });

  const expectRejection = async (args, context, message) => {
    try {
      await updateComment()(undefined, args, context);
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error.message).to.contain(message);
    }
    sinon.assert.notCalled(updateStub);
  };

  it('requires authentication', async () => {
    await expectRejection({ commentId: 'comment-1', content: 'edited' }, {}, 'Authentication required');
  });

  it('lets the author edit their own comment', async () => {
    findByIdStub.resolves(existing());

    await updateComment()(undefined, { commentId: 'comment-1', content: '  edited  ' }, owner);

    // Only content changes, and it is trimmed.
    sinon.assert.calledWith(updateStub, 'comment-1', { $set: { content: 'edited' } }, { new: true });
  });

  it('lets an admin edit anyone\'s comment', async () => {
    findByIdStub.resolves(existing());

    await updateComment()(undefined, { commentId: 'comment-1', content: 'edited' }, admin);

    sinon.assert.called(updateStub);
  });

  it('refuses a user editing someone else\'s comment', async () => {
    findByIdStub.resolves(existing());
    await expectRejection(
      { commentId: 'comment-1', content: 'edited' }, stranger, 'Not authorized',
    );
  });

  it('refuses empty or whitespace-only content', async () => {
    findByIdStub.resolves(existing());
    await expectRejection({ commentId: 'comment-1', content: '   ' }, owner, 'content is required');
  });

  it('refuses editing a deleted comment', async () => {
    findByIdStub.resolves(existing({ deleted: true }));
    await expectRejection({ commentId: 'comment-1', content: 'edited' }, owner, 'deleted comment');
  });

  // editComment (unexposed) used upsert:true, which would create a comment
  // from an arbitrary id. Editing must never create.
  it('refuses a comment that does not exist, rather than creating one', async () => {
    findByIdStub.resolves(null);
    await expectRejection({ commentId: 'nope', content: 'edited' }, owner, 'not found');
  });
});

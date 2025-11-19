import sinon from 'sinon';
import { expect } from 'chai';
import PostModel from '~/resolvers/models/PostModel';
import { deletePost } from '~/resolvers/mutations/post';
import { getPost } from '~/resolvers/queries/post';

describe('Mutations > post > deletePost', () => {
  let findStub;
  let updateStub;

  beforeEach(() => {
    findStub = sinon.stub(PostModel, 'findById');
    updateStub = sinon.stub(PostModel, 'updateOne');
  });

  afterEach(() => {
    findStub.restore();
    updateStub.restore();
  });

  it('should allow creator to delete post', async () => {
    findStub.resolves({ _id: '1', userId: 'user1' });
    updateStub.resolves();
    const result = await deletePost()(undefined, { postId: '1' }, { user: { _id: 'user1' } });
    expect(result).to.deep.equal({ _id: '1' });
    sinon.assert.called(updateStub);
  });

  it('should allow admin to delete any post', async () => {
    findStub.resolves({ _id: '2', userId: 'user2' });
    updateStub.resolves();
    const result = await deletePost()(undefined, { postId: '2' }, { user: { _id: 'admin', admin: true } });
    expect(result).to.deep.equal({ _id: '2' });
    sinon.assert.called(updateStub);
  });

  it('should throw error when user is not provided', async () => {
    findStub.resolves({ _id: '1', userId: 'user1' });
    try {
      await deletePost()(undefined, { postId: '1' }, {});
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).to.equal('Not authorized to delete this post');
    }
    sinon.assert.notCalled(updateStub);
  });

  it('should throw error when user is not the creator and not an admin', async () => {
    findStub.resolves({ _id: '1', userId: 'user1' });
    try {
      await deletePost()(undefined, { postId: '1' }, { user: { _id: 'user2' } });
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).to.equal('Not authorized to delete this post');
    }
    sinon.assert.notCalled(updateStub);
  });
});

describe('Queries > post > getPost with deleted post', () => {
  let findStub;

  beforeEach(() => {
    findStub = sinon.stub(PostModel, 'findById');
  });

  afterEach(() => {
    findStub.restore();
  });

  it('should return null and 404 when post is deleted', async () => {
    const res = { status: sinon.spy() };
    findStub.resolves({ _id: '1', deleted: true });
    const result = await getPost()(undefined, { postId: '1' }, { res });
    expect(result).to.equal(null);
    sinon.assert.calledWith(res.status, 404);
  });
});

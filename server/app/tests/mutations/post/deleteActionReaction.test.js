import sinon from 'sinon';
import { expect } from 'chai';
import ReactionModel from '~/resolvers/models/ReactionModel';
import { deleteActionReaction } from '~/resolvers/mutations/post/deleteActionReaction';

const owner = { user: { _id: 'user-1' } };
const stranger = { user: { _id: 'user-2' } };
const admin = { user: { _id: 'user-2', admin: true } };

const reaction = () => ({
  _id: 'reaction-1',
  userId: { toString: () => 'user-1' },
  emoji: '👍',
});

describe('Mutations > post > deleteActionReaction', () => {
  let findByIdStub;
  let deleteOneStub;

  beforeEach(() => {
    findByIdStub = sinon.stub(ReactionModel, 'findById');
    deleteOneStub = sinon.stub(ReactionModel, 'deleteOne').resolves();
  });

  afterEach(() => {
    findByIdStub.restore();
    deleteOneStub.restore();
  });

  it('requires authentication', async () => {
    try {
      await deleteActionReaction()(undefined, { _id: 'reaction-1' }, {});
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error.message).to.contain('Authentication required');
    }
    sinon.assert.notCalled(deleteOneStub);
  });

  it('lets the author delete their own reaction', async () => {
    findByIdStub.resolves(reaction());

    expect(await deleteActionReaction()(undefined, { _id: 'reaction-1' }, owner)).to.equal(true);
    sinon.assert.calledWith(deleteOneStub, { _id: 'reaction-1' });
  });

  it('lets an admin delete any reaction', async () => {
    findByIdStub.resolves(reaction());

    expect(await deleteActionReaction()(undefined, { _id: 'reaction-1' }, admin)).to.equal(true);
    sinon.assert.called(deleteOneStub);
  });

  it('refuses deleting someone else\'s reaction', async () => {
    findByIdStub.resolves(reaction());

    try {
      await deleteActionReaction()(undefined, { _id: 'reaction-1' }, stranger);
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error.message).to.contain('Not authorized');
    }
    sinon.assert.notCalled(deleteOneStub);
  });

  // Deleting twice is a no-op, not an error — the desired end state is reached.
  it('is idempotent when the reaction is already gone', async () => {
    findByIdStub.resolves(null);

    expect(await deleteActionReaction()(undefined, { _id: 'gone' }, owner)).to.equal(true);
    sinon.assert.notCalled(deleteOneStub);
  });
});

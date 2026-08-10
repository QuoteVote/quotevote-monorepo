import sinon from 'sinon';
import { expect } from 'chai';
import UserModel from '~/resolvers/models/UserModel';
import { updateUser } from '~/resolvers/mutations/user/updateUser';

describe('Mutations > user > updateUser (bio)', () => {
  let findOneStub;
  let updateStub;

  beforeEach(() => {
    findOneStub = sinon.stub(UserModel, 'findOne');
    updateStub = sinon.stub(UserModel, 'update').resolves();
    // No username/email collisions in these cases; the final lookup returns
    // whatever was persisted.
    findOneStub.resolves(null);
  });

  afterEach(() => {
    findOneStub.restore();
    updateStub.restore();
  });

  /** The document handed to UserModel.update for the given input. */
  const persistedFrom = async (user) => {
    await updateUser()(undefined, { user });
    return updateStub.firstCall.args[1];
  };

  it('trims bio before persisting', async () => {
    const persisted = await persistedFrom({ _id: 'user-1', bio: '  hello  ' });
    expect(persisted.bio).to.equal('hello');
  });

  it('rejects bio longer than the maximum length', async () => {
    try {
      await updateUser()(undefined, { user: { _id: 'user-1', bio: 'a'.repeat(501) } });
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error.message).to.contain('500 characters or fewer');
    }
    sinon.assert.notCalled(updateStub);
  });

  it('rejects bio containing HTML', async () => {
    try {
      await updateUser()(undefined, { user: { _id: 'user-1', bio: '<b>hi</b>' } });
      expect.fail('Should have thrown');
    } catch (error) {
      expect(error.message).to.contain('plain text without HTML');
    }
    sinon.assert.notCalled(updateStub);
  });

  it('stores an empty string when bio is cleared', async () => {
    const persisted = await persistedFrom({ _id: 'user-1', bio: '   ' });
    expect(persisted.bio).to.equal('');
  });

  // Omitting bio must not blank an existing one — only an explicit value edits it.
  it('leaves bio untouched when the field is not sent', async () => {
    const persisted = await persistedFrom({ _id: 'user-1', name: 'New Name' });
    expect(persisted).to.not.have.property('bio');
  });
});

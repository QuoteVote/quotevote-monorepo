import { expect } from 'chai';
import sinon from 'sinon';
import UserModel from '~/resolvers/models/UserModel';
import { updateUserPassword } from '~/resolvers/mutations/user/updateUserPassword';
import * as authenticationUtils from '~/utils/authentication';
import { logger } from '~/utils/logger';

const ownerId = '59b003750e3766041440171f';

describe('Mutations > user > updateUserPassword', () => {
  let verifyStub;
  let findByIdStub;
  let updateOneStub;
  let loggerStub;

  const run = (args) => updateUserPassword({})(undefined, args);

  beforeEach(() => {
    verifyStub = sinon.stub(authenticationUtils, 'verifyToken');
    findByIdStub = sinon.stub(UserModel, 'findById');
    updateOneStub = sinon.stub(UserModel, 'updateOne').resolves({ nModified: 1 });
    loggerStub = sinon.stub(logger, 'error');
  });

  afterEach(() => {
    verifyStub.restore();
    findByIdStub.restore();
    updateOneStub.restore();
    loggerStub.restore();
  });

  const tokenFor = (username) => {
    verifyStub.returns({ _id: ownerId });
    findByIdStub.returns({ select: sinon.stub().resolves({ _id: ownerId, username }) });
  };

  it('sets the password of the account the token belongs to', async () => {
    tokenFor('alice');

    const result = await run({ username: 'alice', password: 'New-pass-123', token: 't' });

    expect(result).to.equal(true);
    sinon.assert.calledOnce(updateOneStub);
    expect(updateOneStub.firstCall.args[0]).to.deep.equal({ _id: ownerId });
    expect(updateOneStub.firstCall.args[1]).to.have.property('hash_password');
    expect(updateOneStub.firstCall.args[1].hash_password).to.not.equal('New-pass-123');
  });

  it("refuses to set another account's password with someone else's token", async () => {
    tokenFor('bob');

    let error;
    try {
      await run({ username: 'alice', password: 'New-pass-123', token: 'bobs-token' });
    } catch (err) {
      error = err;
    }

    expect(String(error)).to.contain('Invalid or expired reset link');
    sinon.assert.notCalled(updateOneStub);
  });

  it('refuses a token whose account no longer exists', async () => {
    verifyStub.returns({ _id: ownerId });
    findByIdStub.returns({ select: sinon.stub().resolves(null) });

    let error;
    try {
      await run({ username: 'alice', password: 'New-pass-123', token: 't' });
    } catch (err) {
      error = err;
    }

    expect(String(error)).to.contain('Invalid or expired reset link');
    sinon.assert.notCalled(updateOneStub);
  });

  it('refuses an invalid token', async () => {
    verifyStub.throws(new Error('Invalid access token'));

    let error;
    try {
      await run({ username: 'alice', password: 'New-pass-123', token: 'bad' });
    } catch (err) {
      error = err;
    }

    expect(error).to.not.equal(undefined);
    sinon.assert.notCalled(findByIdStub);
    sinon.assert.notCalled(updateOneStub);
  });
});

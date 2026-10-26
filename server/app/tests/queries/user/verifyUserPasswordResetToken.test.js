import sinon from 'sinon';
import { expect } from 'chai';
import UserModel from '~/resolvers/models/UserModel';
import * as authenticationUtils from '~/utils/authentication';
import { verifyUserPasswordResetToken } from '~/resolvers/queries/user';

const userId = '59b003750e3766041440171f';

describe('Queries > user > verifyUserPasswordResetToken', () => {
  let verifyStub;
  let findByIdStub;

  beforeEach(() => {
    verifyStub = sinon.stub(authenticationUtils, 'verifyToken');
    findByIdStub = sinon.stub(UserModel, 'findById');
  });

  afterEach(() => {
    verifyStub.restore();
    findByIdStub.restore();
  });

  it('returns only public profile fields for a valid token', async () => {
    verifyStub.returns({ _id: userId });
    const lean = sinon.stub().resolves({ _id: userId, username: 'bob', email: 'bob@example.com' });
    const select = sinon.stub().returns({ lean });
    findByIdStub.returns({ select });

    const result = await verifyUserPasswordResetToken()(undefined, { token: 't' });

    expect(findByIdStub.calledWith(userId)).to.equal(true);
    expect(select.calledWith('_id username name email avatar')).to.equal(true);
    expect(result).to.deep.equal({ _id: userId, username: 'bob', email: 'bob@example.com' });
  });

  it('still fails for an invalid token', async () => {
    verifyStub.throws(new Error('Invalid access token'));

    let error;
    try {
      await verifyUserPasswordResetToken()(undefined, { token: 'bad' });
    } catch (err) {
      error = err;
    }

    expect(error).to.be.an('error');
    expect(findByIdStub.called).to.equal(false);
  });
});

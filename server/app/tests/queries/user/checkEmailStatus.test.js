import { expect } from 'chai';
import sinon from 'sinon';
import UserModel from '~/resolvers/models/UserModel';
import { checkEmailStatus } from '~/resolvers/queries/user/checkEmailStatus';
import { logger } from '~/utils/logger';

describe('Queries > user > checkEmailStatus', () => {
  let userModelStub;
  let loggerStub;

  beforeEach(() => {
    userModelStub = sinon.stub(UserModel, 'findOne');
    loggerStub = sinon.stub(logger, 'error');
  });

  afterEach(() => {
    userModelStub.restore();
    loggerStub.restore();
  });

  it('returns not_requested when no user exists', async () => {
    userModelStub.resolves(null);

    const result = await checkEmailStatus()(undefined, {
      email: 'missing@example.com',
    });

    expect(result).to.deep.equal({ status: 'not_requested' });
  });

  it('returns requested_pending for pending or declined invite statuses', async () => {
    userModelStub.onFirstCall().resolves({ status: 1, hash_password: null });
    userModelStub.onSecondCall().resolves({ status: 2, hash_password: null });

    const pendingResult = await checkEmailStatus()(undefined, {
      email: 'pending@example.com',
    });
    const declinedResult = await checkEmailStatus()(undefined, {
      email: 'declined@example.com',
    });

    expect(pendingResult).to.deep.equal({ status: 'requested_pending' });
    expect(declinedResult).to.deep.equal({ status: 'requested_pending' });
  });

  it('returns approved_no_password for approved users without a password', async () => {
    userModelStub.resolves({ status: 4, hash_password: null });

    const result = await checkEmailStatus()(undefined, {
      email: 'approved@example.com',
    });

    expect(result).to.deep.equal({ status: 'approved_no_password' });
  });

  it('returns registered when the user has a password', async () => {
    userModelStub.resolves({ status: 4, hash_password: 'hashed-password' });

    const result = await checkEmailStatus()(undefined, {
      email: 'registered@example.com',
    });

    expect(result).to.deep.equal({ status: 'registered' });
  });

  it('wraps and logs validation errors', async () => {
    try {
      await checkEmailStatus()(undefined, { email: '' });
      expect.fail('Expected error to be thrown');
    } catch (error) {
      expect(error.message).to.equal(
        'Failed to check email status: Email parameter is required',
      );
      sinon.assert.calledOnce(loggerStub);
    }
  });
});

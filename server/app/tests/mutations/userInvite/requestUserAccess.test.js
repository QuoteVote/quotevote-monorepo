import { expect } from 'chai';
import sinon from 'sinon';
import { UserInputError } from 'apollo-server-express';
import UserModel from '~/resolvers/models/UserModel';
import { requestUserAccess } from '~/resolvers/mutations/userInvite/requestUserAccess';
import * as sendGridUtils from '~/utils/send-grid-mail';

describe('Mutations > userInvite > requestUserAccess', () => {
  let findOneStub;
  let saveStub;
  let sendGridEmailStub;

  beforeEach(() => {
    process.env.SENDGRID_SENDER_EMAIL = 'noreply@example.com';

    findOneStub = sinon.stub(UserModel, 'findOne');
    saveStub = sinon.stub(UserModel.prototype, 'save');
    sendGridEmailStub = sinon
      .stub(sendGridUtils, 'default')
      .resolves({ success: true });
  });

  afterEach(() => {
    findOneStub.restore();
    saveStub.restore();
    sendGridEmailStub.restore();
  });

  it('creates a prospect and sends confirmation email for new request', async () => {
    findOneStub.resolves(null);
    saveStub.resolves({
      _id: 'new-user-id',
      email: 'new@example.com',
      status: 1,
    });

    const resolver = requestUserAccess();
    const result = await resolver(
      undefined,
      {
        requestUserAccessInput: { email: 'new@example.com' },
      },
      { requestId: 'req-test-1' },
    );

    expect(result).to.deep.equal({
      _id: 'new-user-id',
      email: 'new@example.com',
      status: 1,
    });

    sinon.assert.calledOnce(sendGridEmailStub);
    expect(sendGridEmailStub.firstCall.args[0]).to.deep.include({
      requestId: 'req-test-1',
      to: 'new@example.com',
      from: 'Team Quote.Vote <noreply@example.com>',
      templateId: sendGridUtils.SENGRID_TEMPLATE_IDS.INVITE_REQUEST_RECEIVED_CONFIRMATION,
    });
  });

  it('reuses existing pending user and sends confirmation email', async () => {
    findOneStub.resolves({
      _id: 'existing-id',
      email: 'pending@example.com',
      status: 1,
    });

    const resolver = requestUserAccess();
    const result = await resolver(
      undefined,
      {
        requestUserAccessInput: { email: 'pending@example.com' },
      },
      { requestId: 'req-test-2' },
    );

    expect(result).to.deep.equal({
      _id: 'existing-id',
      email: 'pending@example.com',
      status: 1,
    });

    sinon.assert.notCalled(saveStub);
    sinon.assert.calledOnce(sendGridEmailStub);
  });

  it('throws when email belongs to a non-pending account', async () => {
    findOneStub.resolves({
      _id: 'registered-id',
      email: 'registered@example.com',
      status: 4,
    });

    const resolver = requestUserAccess();

    let thrownError;
    try {
      await resolver(
        undefined,
        {
          requestUserAccessInput: { email: 'registered@example.com' },
        },
        { requestId: 'req-test-3' },
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).to.be.instanceOf(UserInputError);
    expect(thrownError.message).to.equal('Email already exists');
    sinon.assert.notCalled(sendGridEmailStub);
  });
});

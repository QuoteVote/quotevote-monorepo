import { expect } from 'chai';
import sinon from 'sinon';
import UserModel from '~/resolvers/models/UserModel';
import { sendMagicLoginLink } from '~/resolvers/mutations/user/sendMagicLoginLink';
import * as authenticationUtils from '~/utils/authentication';
import * as sendGridUtils from '~/utils/send-grid-mail';
import { logger } from '~/utils/logger';

describe('Mutations > user > sendMagicLoginLink', () => {
  let userModelStub;
  let addCreatorToUserStub;
  let sendGridEmailStub;
  let loggerStub;

  beforeEach(() => {
    process.env.CLIENT_URL = 'https://example.com';
    process.env.SENDGRID_SENDER_EMAIL = 'noreply@example.com';

    userModelStub = sinon.stub(UserModel, 'findOne');
    addCreatorToUserStub = sinon
      .stub(authenticationUtils, 'addCreatorToUser')
      .resolves('magic-token');
    sendGridEmailStub = sinon
      .stub(sendGridUtils, 'default')
      .resolves({ success: true });
    loggerStub = sinon.stub(logger, 'error');
  });

  afterEach(() => {
    userModelStub.restore();
    addCreatorToUserStub.restore();
    sendGridEmailStub.restore();
    loggerStub.restore();
  });

  it('returns generic success when no user matches the email', async () => {
    userModelStub.resolves(null);

    const result = await sendMagicLoginLink()(undefined, {
      email: 'missing@example.com',
    });

    expect(result).to.deep.equal({
      success: true,
      message:
        'If an account exists with that email, a login link has been sent.',
    });
    sinon.assert.notCalled(addCreatorToUserStub);
    sinon.assert.notCalled(sendGridEmailStub);
  });

  it('returns a signup-completion error for users without passwords', async () => {
    userModelStub.resolves({ status: 4, hash_password: null });

    const result = await sendMagicLoginLink()(undefined, {
      email: 'approved@example.com',
    });

    expect(result).to.deep.equal({
      success: false,
      message: 'This account has not completed signup yet.',
    });
    sinon.assert.notCalled(addCreatorToUserStub);
    sinon.assert.notCalled(sendGridEmailStub);
  });

  it('sends the dedicated magic login template for registered users', async () => {
    userModelStub.resolves({
      username: 'registered-user',
      hash_password: 'hashed-password',
    });

    const result = await sendMagicLoginLink()(undefined, {
      email: 'registered@example.com',
    });

    expect(result).to.deep.equal({
      success: true,
      message:
        'If an account exists with that email, a login link has been sent.',
    });

    sinon.assert.calledOnce(addCreatorToUserStub);
    sinon.assert.calledOnce(sendGridEmailStub);
    expect(sendGridEmailStub.firstCall.args[0]).to.deep.include({
      to: 'registered@example.com',
      from: 'Team Quote.Vote <noreply@example.com>',
      templateId: sendGridUtils.SENGRID_TEMPLATE_IDS.MAGIC_LOGIN,
    });
    expect(
      sendGridEmailStub.firstCall.args[0].dynamicTemplateData,
    ).to.deep.equal({
      MAGIC_LINK_URL: 'https://example.com/auth/magic-login?token=magic-token',
    });
  });
});

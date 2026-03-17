import { expect } from 'chai';
import sinon from 'sinon';
import UserModel from '~/resolvers/models/UserModel';
import { sendOnboardingCompletionLink } from '~/resolvers/mutations/user/sendOnboardingCompletionLink';
import * as authenticationUtils from '~/utils/authentication';
import * as sendGridUtils from '~/utils/send-grid-mail';
import { logger } from '~/utils/logger';

describe('Mutations > user > sendOnboardingCompletionLink', () => {
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
      .resolves('onboarding-token');
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

  it('returns generic success when no eligible account exists', async () => {
    userModelStub.resolves(null);

    const result = await sendOnboardingCompletionLink()(undefined, {
      email: 'missing@example.com',
    });

    expect(result).to.deep.equal({
      success: true,
      message:
        'If an eligible account exists with that email, an onboarding link has been sent.',
    });
    sinon.assert.notCalled(addCreatorToUserStub);
    sinon.assert.notCalled(sendGridEmailStub);
  });

  it('returns generic success when the user already completed signup', async () => {
    userModelStub.resolves({ status: 4, hash_password: 'hashed-password' });

    const result = await sendOnboardingCompletionLink()(undefined, {
      email: 'registered@example.com',
    });

    expect(result).to.deep.equal({
      success: true,
      message:
        'If an eligible account exists with that email, an onboarding link has been sent.',
    });
    sinon.assert.notCalled(addCreatorToUserStub);
    sinon.assert.notCalled(sendGridEmailStub);
  });

  it('emails a tokenized signup link for approved users without passwords', async () => {
    userModelStub.resolves({
      status: 4,
      hash_password: null,
      username: 'approved-user',
    });

    const result = await sendOnboardingCompletionLink()(undefined, {
      email: 'approved@example.com',
    });

    expect(result).to.deep.equal({
      success: true,
      message:
        'If an eligible account exists with that email, an onboarding link has been sent.',
    });

    sinon.assert.calledOnce(addCreatorToUserStub);
    sinon.assert.calledOnce(sendGridEmailStub);
    expect(sendGridEmailStub.firstCall.args[0]).to.deep.include({
      to: 'approved@example.com',
      from: 'Team Quote.Vote <noreply@example.com>',
      templateId: sendGridUtils.SENGRID_TEMPLATE_IDS.INVITATION_APPROVE,
    });
    expect(
      sendGridEmailStub.firstCall.args[0].dynamicTemplateData,
    ).to.deep.equal({
      create_password_url:
        'https://example.com/auth/signup?token=onboarding-token',
    });
  });
});

import { expect } from 'chai';
import sinon from 'sinon';
import UserModel from '~/resolvers/models/UserModel';
import { sendPasswordResetEmail } from '~/resolvers/mutations/user/sendPasswordResetEmail';
import * as authenticationUtils from '~/utils/authentication';
import { logger } from '~/utils/logger';
import * as sendGridUtils from '~/utils/send-grid-mail';

describe('Mutations > user > sendPasswordResetEmail', () => {
  let userModelStub;
  let addCreatorToUserStub;
  let sendGridEmailStub;
  let loggerStub;
  let mockPubsub;

  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    username: 'testuser',
    fullName: 'Test User',
  };

  const mockToken = 'mock-jwt-token-123';

  beforeEach(() => {
    process.env.CLIENT_URL = 'https://example.com';
    process.env.SENDGRID_SENDER_EMAIL = 'noreply@example.com';

    userModelStub = sinon.stub(UserModel, 'findOne');
    addCreatorToUserStub = sinon.stub(authenticationUtils, 'addCreatorToUser').resolves(mockToken);
    sendGridEmailStub = sinon.stub(sendGridUtils, 'default').resolves({ success: true });
    loggerStub = sinon.stub(logger, 'error');

    mockPubsub = {};
  });

  afterEach(() => {
    userModelStub.restore();
    addCreatorToUserStub.restore();
    sendGridEmailStub.restore();
    loggerStub.restore();
  });

  describe('Successful password reset email', () => {
    it('should send password reset email when user exists', async () => {
      userModelStub.resolves(mockUser);
      const args = { email: 'test@example.com' };

      const result = await sendPasswordResetEmail(mockPubsub)(undefined, args);

      expect(result).to.deep.equal(mockUser);
      
      sinon.assert.calledOnceWithExactly(userModelStub, { email: 'test@example.com' });

      sinon.assert.calledOnceWithExactly(addCreatorToUserStub, {
        username: 'testuser',
        password: '',
        requirePassword: false,
      }, sinon.match.func, false, 60 * 60, true);

      sinon.assert.calledOnce(sendGridEmailStub);
      const emailCall = sendGridEmailStub.getCall(0);
      const mailOptions = emailCall.args[0];
      
      expect(mailOptions).to.deep.include({
        to: 'test@example.com',
        from: 'Team Quote.Vote <noreply@example.com>',
        templateId: sendGridUtils.SENGRID_TEMPLATE_IDS.PASSWORD_RESET,
      });
      
      expect(mailOptions.dynamicTemplateData).to.deep.include({
        change_password_url: `https://example.com/auth/password-reset?token=${mockToken}&username=testuser`,
      });
    });

    it('should handle different email formats correctly', async () => {
      const userWithDifferentEmail = { ...mockUser, email: 'different@test.com' };
      userModelStub.resolves(userWithDifferentEmail);
      const args = { email: 'different@test.com' };

      const result = await sendPasswordResetEmail(mockPubsub)(undefined, args);

      expect(result).to.deep.equal(userWithDifferentEmail);
      sinon.assert.calledOnceWithExactly(userModelStub, { email: 'different@test.com' });
    });
  });

  describe('User not found scenarios', () => {
    it('should throw wrapped error when email is not found', async () => {
      userModelStub.resolves(null);
      const args = { email: 'nonexistent@example.com' };

      try {
        await sendPasswordResetEmail(mockPubsub)(undefined, args);
        expect.fail('Expected error to be thrown');
      } catch (error) {
        expect(error).to.equal('Update failed! Email not found');
        sinon.assert.calledOnce(loggerStub);
      }

      sinon.assert.notCalled(addCreatorToUserStub);
      sinon.assert.notCalled(sendGridEmailStub);
    });

    it('should throw wrapped error when user is undefined', async () => {
      userModelStub.resolves(undefined);
      const args = { email: 'undefined@example.com' };

      try {
        await sendPasswordResetEmail(mockPubsub)(undefined, args);
        expect.fail('Expected error to be thrown');
      } catch (error) {
        expect(error).to.equal('Update failed! Email not found');
        sinon.assert.calledOnce(loggerStub);
      }
    });
  });
});

import sinon from 'sinon';
import { expect } from 'chai';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import UserModel from '~/resolvers/models/UserModel';
import { getUsers } from '~/resolvers/queries/user';

const usersData = [
  {
    _id: '59b003750e3766041440171f',
  },
  {
    _id: '59b006a2dba5fb0027f48c76',
  },
  {
    _id: '5a8021eaf0b7f71bc8c6dbdc',
  },
];

const expectedUsersData = [
  {
    _id: '59b003750e3766041440171f',
    userId: '59b003750e3766041440171f',
  },
  {
    _id: '59b006a2dba5fb0027f48c76',
    userId: '59b006a2dba5fb0027f48c76',
  },
  {
    _id: '5a8021eaf0b7f71bc8c6dbdc',
    userId: '5a8021eaf0b7f71bc8c6dbdc',
  },
];

describe('Queries > user > getUsers', () => {
  let usersModelStub;

  beforeEach(() => {
    usersModelStub = sinon.stub(UserModel, 'find');
  });

  afterEach(() => {
    usersModelStub.restore();
  });

  it('should throw AuthenticationError when no user is authenticated', async () => {
    try {
      await getUsers()(undefined, {}, {});
      expect.fail('Should have thrown AuthenticationError');
    } catch (error) {
      expect(error).to.be.instanceOf(AuthenticationError);
      expect(error.message).to.equal('Authentication required');
    }
  });

  it('should throw ForbiddenError when user is not admin', async () => {
    const nonAdminUser = { _id: 'user123', admin: false };
    try {
      await getUsers()(undefined, {}, { user: nonAdminUser });
      expect.fail('Should have thrown ForbiddenError');
    } catch (error) {
      expect(error).to.be.instanceOf(ForbiddenError);
      expect(error.message).to.equal('Admin access required');
    }
  });

  it('should return paginated users when admin is authenticated', async () => {
    // Mock the UserModel.find to return data with _doc property like Mongoose does
    const mockUsers = usersData.map((user) => ({
      _id: user._id,
      _doc: user,
    }));
    
    const mockQuery = {
      limit: sinon.stub().returnsThis(),
      skip: sinon.stub().returnsThis(),
      select: sinon.stub().resolves(mockUsers),
    };
    
    usersModelStub.returns(mockQuery);
    
    const adminUser = { _id: 'admin123', admin: true };
    const args = { limit: 10, offset: 0 };
    const result = await getUsers()(undefined, args, { user: adminUser });
    
    expect(result).to.deep.equal(expectedUsersData);
    sinon.assert.called(usersModelStub);
    sinon.assert.calledWith(mockQuery.limit, 10);
    sinon.assert.calledWith(mockQuery.skip, 0);
    sinon.assert.calledWith(mockQuery.select, '-__v -passwordResetToken -passwordResetExpires -emailVerificationToken');
  });

  it('should use default pagination when no args provided', async () => {
    const mockQuery = {
      limit: sinon.stub().returnsThis(),
      skip: sinon.stub().returnsThis(),
      select: sinon.stub().resolves([]),
    };
    
    usersModelStub.returns(mockQuery);
    
    const adminUser = { _id: 'admin123', admin: true };
    await getUsers()(undefined, {}, { user: adminUser });
    
    sinon.assert.calledWith(mockQuery.limit, 50); // default limit
    sinon.assert.calledWith(mockQuery.skip, 0);  // default offset
  });
});

import sinon from 'sinon';
import { expect } from 'chai';
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

  it('should return all users when admin user is authenticated', async () => {
    // Mock the UserModel.find to return a chainable query object like Mongoose does
    const mockUsers = usersData.map((user) => ({
      _id: user._id,
      _doc: user,
    }));
    
    const mockQuery = {
      limit: sinon.stub().returnsThis(),
      skip: sinon.stub().returnsThis(),
      select: sinon.stub().returnsThis(),
      sort: sinon.stub().resolves(mockUsers),
    };
    usersModelStub.returns(mockQuery);
    
    const context = { user: { _id: 'admin', admin: true } };
    const result = await getUsers()(undefined, {}, context);
    expect(result).to.deep.equal(expectedUsersData);
    sinon.assert.called(usersModelStub);
  });

  it('should throw error when user is not authenticated', async () => {
    try {
      await getUsers()(undefined, {}, {});
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).to.equal('Authentication required to access user data');
    }
    sinon.assert.notCalled(usersModelStub);
  });

  it('should throw error when user is not an admin', async () => {
    try {
      const context = { user: { _id: 'user1', admin: false } };
      await getUsers()(undefined, {}, context);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error.message).to.equal('Admin access required to query all users');
    }
    sinon.assert.notCalled(usersModelStub);
  });
});

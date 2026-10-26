import sinon from 'sinon';
import { expect } from 'chai';
import UserModel from '~/resolvers/models/UserModel';
import { findUserByEmail } from '~/resolvers/queries/user';

const query = (users) => ({ select: sinon.stub().resolves(users) });

describe('Queries > user > findUserByEmail (checkDuplicateEmail)', () => {
  let findStub;

  beforeEach(() => {
    findStub = sinon.stub(UserModel, 'find');
  });

  afterEach(() => {
    findStub.restore();
  });

  it('returns one entry per match without any user fields', async () => {
    findStub.returns(query([{ _id: 'a', status: 4, hash_password: 'secret', username: 'bob' }]));

    const result = await findUserByEmail()(undefined, { email: 'bob@example.com' }, {});

    expect(result).to.deep.equal([{ isDuplicate: false, duplicateCount: 1 }]);
    expect(findStub.firstCall.returnValue.select.calledWith('status')).to.equal(true);
  });

  it('matches the email literally, so regex characters find nothing extra', async () => {
    findStub.returns(query([]));

    await findUserByEmail()(undefined, { email: 'a.b+c@example.com' }, {});

    const { $regex: pattern } = findStub.firstCall.args[0].email;
    expect(pattern.source).to.equal('^a\\.b\\+c@example\\.com$');
    expect(pattern.test('A.B+C@EXAMPLE.COM')).to.equal(true);
    expect(pattern.test('axb+c@example.com')).to.equal(false);
  });

  it('keeps an undecided request out of the duplicates', async () => {
    findStub.returns(query([{ status: 1 }]));

    const result = await findUserByEmail()(undefined, { email: 'new@example.com' }, {});

    expect(result).to.deep.equal([]);
  });
});

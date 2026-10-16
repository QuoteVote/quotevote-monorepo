import sinon from 'sinon';
import { expect } from 'chai';
import UserReportModel from '~/resolvers/models/UserReportModel';
import { getUserReports } from '~/resolvers/queries/user';

const reportedUserId = '59b003750e3766041440171f';
const reports = [{ _id: 'r1', reason: 'spam', status: 'pending' }];

const chainResolving = (value) => {
  const chain = {
    populate: sinon.stub().returnsThis(),
    sort: sinon.stub().resolves(value),
  };
  return chain;
};

describe('Queries > user > getUserReports', () => {
  let findStub;

  beforeEach(() => {
    findStub = sinon.stub(UserReportModel, 'find').returns(chainResolving(reports));
  });

  afterEach(() => {
    findStub.restore();
  });

  const expectForbidden = async (context) => {
    let error;
    try {
      await getUserReports()(undefined, { userId: reportedUserId }, context);
    } catch (e) {
      error = e;
    }
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.equal('Admin access required to view user reports');
    expect(findStub.called).to.equal(false);
  };

  it('returns reports to an admin', async () => {
    const result = await getUserReports()(undefined, { userId: reportedUserId }, { user: { _id: 'a1', admin: true } });
    expect(result).to.deep.equal(reports);
    expect(findStub.calledOnceWith({ _reportedUserId: reportedUserId })).to.equal(true);
  });

  it('rejects a logged-in user who is not an admin', async () => {
    await expectForbidden({ user: { _id: 'u1', admin: false } });
  });

  it('rejects a logged-out caller', async () => {
    await expectForbidden({});
    await expectForbidden(undefined);
  });
});

import sinon from 'sinon';
import { expect } from 'chai';
import QuoteModel from '~/resolvers/models/QuoteModel';
import { latestQuotes, MAX_LATEST_QUOTES } from '~/resolvers/queries/quote/latestQuotes';

describe('Queries > quote > latestQuotes', () => {
  let findStub;
  let chain;

  beforeEach(() => {
    chain = {
      sort: sinon.stub().returnsThis(),
      limit: sinon.stub().resolves([]),
    };
    findStub = sinon.stub(QuoteModel, 'find').returns(chain);
  });

  afterEach(() => {
    findStub.restore();
  });

  it('returns the newest quotes first and excludes deleted ones', async () => {
    await latestQuotes()(undefined, { limit: 5 });

    sinon.assert.calledWith(findStub, { deleted: { $ne: true } });
    sinon.assert.calledWith(chain.sort, { created: 'desc' });
    sinon.assert.calledWith(chain.limit, 5);
  });

  it('caps an oversized limit', async () => {
    await latestQuotes()(undefined, { limit: 10000 });

    sinon.assert.calledWith(chain.limit, MAX_LATEST_QUOTES);
  });

  it('falls back to the cap for a missing or nonsensical limit', async () => {
    await latestQuotes()(undefined, { limit: 0 });
    sinon.assert.calledWith(chain.limit, MAX_LATEST_QUOTES);

    await latestQuotes()(undefined, {});
    sinon.assert.calledWith(chain.limit, MAX_LATEST_QUOTES);
  });

  it('returns whatever the query resolves to', async () => {
    chain.limit.resolves([{ _id: 'quote-1', quote: 'hello' }]);

    const result = await latestQuotes()(undefined, { limit: 1 });

    expect(result).to.deep.equal([{ _id: 'quote-1', quote: 'hello' }]);
  });
});

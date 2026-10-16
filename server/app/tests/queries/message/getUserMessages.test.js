import sinon from 'sinon';
import { expect } from 'chai';
import MessageModel from '~/resolvers/models/MessageModel';
import MessageRoomModel from '~/resolvers/models/MessageRoomModel';
import UserModel from '~/resolvers/models/UserModel';
import { getUserMessages } from '~/resolvers/queries/message';

const roomId = '5aa672afb880071ad072dc93';
const memberId = '5a8021eaf0b7f71bc8c6dbdc';
const otherId = '59b006a2dba5fb0027f48c76';

const message = {
  _id: '5a8c813dd611e3395d65db3d',
  messageRoomId: roomId,
  userId: memberId,
  title: '',
  text: 'hello',
  created: new Date('2026-01-01T00:00:00Z'),
  readBy: [],
};

describe('Queries > message > getUserMessages', () => {
  let roomStub;
  let messageStub;
  let userStub;

  beforeEach(() => {
    roomStub = sinon.stub(MessageRoomModel, 'findById');
    messageStub = sinon.stub(MessageModel, 'find').resolves([message]);
    userStub = sinon.stub(UserModel, 'findOne').resolves({ name: 'Member', avatar: '' });
  });

  afterEach(() => {
    roomStub.restore();
    messageStub.restore();
    userStub.restore();
  });

  it('returns a post discussion to a logged-out visitor', async () => {
    roomStub.resolves({ messageType: 'POST', users: [memberId] });
    const result = await getUserMessages()(undefined, { messageRoomId: roomId }, {});
    expect(result).to.have.length(1);
    expect(result[0].text).to.equal('hello');
  });

  it('returns a direct-message room to one of its members', async () => {
    roomStub.resolves({ messageType: 'USER', users: [memberId, otherId] });
    const context = { user: { _id: memberId } };
    const result = await getUserMessages()(undefined, { messageRoomId: roomId }, context);
    expect(result).to.have.length(1);
  });

  it('rejects a logged-out caller for a direct-message room', async () => {
    roomStub.resolves({ messageType: 'USER', users: [memberId, otherId] });
    let error;
    try {
      await getUserMessages()(undefined, { messageRoomId: roomId }, {});
    } catch (e) {
      error = e;
    }
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.equal('Not authorized to read this conversation');
    expect(messageStub.called).to.equal(false);
  });

  it('rejects a logged-in user who is not in the direct-message room', async () => {
    roomStub.resolves({ messageType: 'USER', users: [otherId] });
    let error;
    try {
      await getUserMessages()(undefined, { messageRoomId: roomId }, { user: { _id: memberId } });
    } catch (e) {
      error = e;
    }
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.equal('Not authorized to read this conversation');
    expect(messageStub.called).to.equal(false);
  });

  it('returns an empty list for a room that does not exist', async () => {
    roomStub.resolves(null);
    const result = await getUserMessages()(undefined, { messageRoomId: roomId }, {});
    expect(result).to.deep.equal([]);
    expect(messageStub.called).to.equal(false);
  });
});

import { expect } from 'chai';
import { canReadRoom } from '~/utils/roomAccess';

const memberId = '5a8021eaf0b7f71bc8c6dbdc';
const otherId = '59b006a2dba5fb0027f48c76';

describe('utils > roomAccess > canReadRoom', () => {
  it('lets anyone read a post discussion room, logged out included', () => {
    const room = { messageType: 'POST', users: [memberId] };
    expect(canReadRoom(room, undefined)).to.equal(true);
    expect(canReadRoom(room, { _id: otherId })).to.equal(true);
  });

  it('lets a member read their direct-message room', () => {
    const room = { messageType: 'USER', users: [memberId, otherId] };
    expect(canReadRoom(room, { _id: memberId })).to.equal(true);
  });

  it('blocks a logged-in user who is not in the direct-message room', () => {
    const room = { messageType: 'USER', users: [otherId] };
    expect(canReadRoom(room, { _id: memberId })).to.equal(false);
  });

  it('blocks a logged-out caller from a direct-message room', () => {
    const room = { messageType: 'USER', users: [memberId] };
    expect(canReadRoom(room, undefined)).to.equal(false);
    expect(canReadRoom(room, {})).to.equal(false);
  });

  it('compares ObjectId-like ids by their string value', () => {
    const asObjectId = (id) => ({ toString: () => id });
    const room = { messageType: 'USER', users: [asObjectId(memberId)] };
    expect(canReadRoom(room, { _id: asObjectId(memberId) })).to.equal(true);
  });

  it('blocks a missing room', () => {
    expect(canReadRoom(null, { _id: memberId })).to.equal(false);
  });
});

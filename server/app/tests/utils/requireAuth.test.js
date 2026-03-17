import requireAuth from '~/utils/requireAuth';

describe('requireAuth', () => {
  it('returns false for public checkEmailStatus query', () => {
    const query = `
      query checkEmailStatus($email: String!) {
        checkEmailStatus(email: $email)
      }
    `;

    expect(requireAuth(query)).toBe(false);
  });

  it('returns false for public sendMagicLoginLink mutation', () => {
    const mutation = `
      mutation sendMagicLoginLink($email: String!) {
        sendMagicLoginLink(email: $email)
      }
    `;

    expect(requireAuth(mutation)).toBe(false);
  });

  it('returns true for protected users query', () => {
    const query = `
      query getUsers {
        users {
          _id
        }
      }
    `;

    expect(requireAuth(query)).toBe(true);
  });

  it('returns true when operation mixes public and protected root fields', () => {
    const query = `
      query mixed($email: String!) {
        checkEmailStatus(email: $email)
        users {
          _id
        }
      }
    `;

    expect(requireAuth(query)).toBe(true);
  });

  it('returns true when query cannot be parsed', () => {
    const invalidQuery = 'this is not graphql';

    expect(requireAuth(invalidQuery)).toBe(true);
  });
});

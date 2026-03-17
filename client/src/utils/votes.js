export const getVisibleVotes = (
  votes = [],
  anonymousVotes = [],
  showAnonymousVotes = true,
) => (showAnonymousVotes ? [...votes, ...anonymousVotes] : votes)

export const getVoteCounts = (votes = []) => votes.reduce(
  (result, vote) => ({
    up: result.up + (vote.type === 'up' ? 1 : 0),
    down: result.down + (vote.type === 'down' ? 1 : 0),
  }),
  { up: 0, down: 0 },
)

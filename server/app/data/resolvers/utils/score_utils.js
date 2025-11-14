import chalk from 'chalk';
import Promise from 'promise';
import VotesModel from '../models/VoteModel';
import ArtistsModel from '../models/Artists';
import UsersModel from '../models/UserModel';
import { logger } from '../../utils/logger';

const filters = (args) => {
  const filter = {};
  if (args.user_id) filter._userId = args.user_id;
  if (args.song_id) filter._songId = args.song_id;
  if (args.artist_id) filter._artistId = args.artist_id;

  return filter;
};

const reducer = (bucket, currentValue) => {
  const polar = currentValue.isUpvote ? 1 : -1;
  return bucket + currentValue.tokens * polar;
};

export const scoreUtil = async (args) => {
  const songs = await VotesModel.find({ ...filters(args) });
  return songs.reduce(reducer, 0);
};

export const voteTypeUtil = async (args) => {
  const votes = await VotesModel.find({
    ...filters(args),
    isUpvote: args.vote_type,
  });
  return votes.reduce(reducer, 0);
};

export const scoreBySong = (pubsub) => {
  return async (_, args) => {
    logger.debug('Function: scoreBySong', { songId: args.song_id });

    const songs = await VotesModel.find({ _songId: args.song_id });

    const reducer = (bucket, currentValue) => {
      const polar = currentValue.isUpvote ? 1 : -1;
      return bucket + currentValue.tokens * polar;
    };
    return songs.reduce(reducer, 0);
  };
};

export const score = (pubsub) => {
  return async (_, args) => {
    logger.debug('Function: score', { args });

    const songs = await VotesModel.find({ ...filters(args) });
    const reducer = (bucket, currentValue) => {
      const polar = currentValue.isUpvote ? 1 : -1;
      return bucket + currentValue.tokens * polar;
    };
    return songs.reduce(reducer, 0);
  };
};

export const upvotes = (pubsub) => {
  return async (_, args) => {
    logger.debug('Function: upvotes', { args });

    const votes = await VotesModel.find({ ...filters(args), isUpvote: true });
    return votes.length;
  };
};

export const downvotes = (pubsub) => {
  return async (_, args) => {
    logger.debug('Function: downvotes', { args });

    const votes = await VotesModel.find({ ...filters(args), isUpvote: false });
    return votes.length;
  };
};

export const topArtists = (pubsub) => {
  return async (_, args) => {
    const { limit } = args;
    const artists = await ArtistsModel.find({});

    const artistsIds = artists.map((artist) => artist.artistId);

    const scoresList = await Promise.all(artistsIds.map(async (id) => {
      const ownedVotes = await VotesModel.find({ _artistId: id });
      const totalScore = ownedVotes.reduce(reducer, 0);

      const artist = await ArtistsModel.find({ artistId: id });

      return {
        totalScore,
        artistId: id,
        artistName: artist[0].name,
      };
    }));

    scoresList.sort((a, b) => b.totalScore - a.totalScore);

    return scoresList.slice(0, limit);
  };
};

export const topUsers = (pubsub) => {
  return async (_, args) => {
    const { limit } = args;
    const users = await UsersModel.find({});
    const usersIds = users.map((user) => user._id);

    const userVoteCounts = await Promise.all(usersIds.map(async (id) => {
      const userVotes = await VotesModel.find({ _userId: id });
      const score = userVotes.reduce(reducer, 0);

      const user = await UsersModel.find({ _id: id });
      return {
        score,
        userId: id,
        user: user[0].username,
      };
    }));
    userVoteCounts.sort((a, b) => b.score - a.score);
    return userVoteCounts.slice(0, limit);
  };
};

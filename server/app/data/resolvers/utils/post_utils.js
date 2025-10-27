import { isEmpty } from 'lodash';
import PostModel from '../models/PostModel';

export const updateTrending = async (postId) => {
  const post = await PostModel.findOne({ _id: postId });

  // check if posts pointTimestamp is within 24hrs
  const isPostWithin24hrs = await PostModel.find({
    _id: postId,
    pointTimestamp: {
      $lt: new Date(),
      $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
  });

  // posts pointTimestamp is not within 24hrs
  if (isEmpty(isPostWithin24hrs)) {
    await PostModel.update(
      { _id: postId },
      {
        $set: {
          pointTimestamp: new Date(),
          dayPoints: 1,
        },
      },
    );
  } else {
    // increment dayPoint by 1 and update pointTimestamp using currentDate
    await PostModel.update(
      { _id: postId },
      {
        $set: {
          pointTimestamp: new Date(),
          dayPoints: post.dayPoints + 1,
        },
      },
    );
  }

  // call subscription here for Trending page
};

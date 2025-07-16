import mongoose from 'mongoose';
import PostModel from '../../models/PostModel';
import UserModel from '../../models/UserModel';

export const topPosts = () => {
  return async (_, args, context) => {
    const {
      limit,
      offset,
      searchKey,
      startDateRange,
      endDateRange,
      friendsOnly,
      groupId,
      userId,
      approved,
      interactions,
      sortOrder,
    } = args;

    // Build search arguments
    const searchArgs = {};

    // Handle text search - can be combined with other filters
    if (searchKey && searchKey.trim()) {
      searchArgs.$or = [
        { title: { $regex: searchKey.trim(), $options: 'i' } },
        { text: { $regex: searchKey.trim(), $options: 'i' } },
      ];
    }

    // Handle date range filter - can be combined with search and friendsOnly
    if (startDateRange && endDateRange) {
      searchArgs.pointTimestamp = {
        $gte: new Date(startDateRange),
        $lte: new Date(endDateRange),
      };
    } else if (startDateRange) {
      // Handle single start date
      searchArgs.pointTimestamp = {
        $gte: new Date(startDateRange),
      };
    } else if (endDateRange) {
      // Handle single end date
      searchArgs.pointTimestamp = {
        $lte: new Date(endDateRange),
      };
    }

    // Handle groupId filter - can be combined with other filters
    if (groupId) {
      searchArgs.groupId = groupId;
    }

    // Handle userId filter - if userId is provided, only return posts for that user
    if (userId) {
      console.log('topPosts - userId filter applied:', userId);
      console.log('topPosts - userId type:', typeof userId);

      // Convert userId to ObjectId if it's a string to ensure proper matching
      const userIdToFilter = mongoose.Types.ObjectId.isValid(userId)
        ? mongoose.Types.ObjectId(userId)
        : userId;

      searchArgs.userId = userIdToFilter;

      // When filtering by specific userId, ignore friendsOnly filter
      // This ensures we get all posts for the specified user
      console.log('topPosts - searchArgs with userId:', searchArgs);
    } else if (friendsOnly) {
      // Handle friendsOnly filter - only apply when no specific userId is requested
      if (!context.user || !context.user._id) {
        // eslint-disable-line no-underscore-dangle
        // If friendsOnly is requested but no user context, return empty results
        return {
          entities: [],
          pagination: {
            total_count: 0,
            limit,
            offset,
          },
        };
      }

      // Get the current user's following list
      const currentUser = await UserModel.findById(
        context.user._id, // eslint-disable-line no-underscore-dangle
      );
      if (
        currentUser
        && currentUser._followingId // eslint-disable-line no-underscore-dangle
        && currentUser._followingId.length > 0 // eslint-disable-line no-underscore-dangle
      ) {
        searchArgs.userId = {
          $in: currentUser._followingId, // eslint-disable-line no-underscore-dangle
        };
      } else {
        // If user has no following, return empty results
        return {
          entities: [],
          pagination: {
            total_count: 0,
            limit,
            offset,
          },
        };
      }
    }

    // Handle approved filter - can be combined with other filters
    if (approved !== undefined) {
      searchArgs.approved = approved;
    }

    // Determine sort direction based on sortOrder parameter
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    let trendingPosts;
    let totalPosts;

    if (interactions) {
      // When interactions is true, use aggregation to get posts with interaction counts
      const aggregationPipeline = [
        { $match: searchArgs },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'postId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: 'votes',
            localField: '_id',
            foreignField: 'postId',
            as: 'votes',
          },
        },
        {
          $addFields: {
            commentCount: { $size: '$comments' },
            voteCount: { $size: '$votes' },
            totalInteractions: {
              $add: [{ $size: '$comments' }, { $size: '$votes' }],
            },
          },
        },
        {
          $sort: {
            totalInteractions: sortDirection,
            commentCount: sortDirection,
            voteCount: sortDirection,
            dayPoints: sortDirection,
            pointTimestamp: sortDirection,
            created: sortDirection,
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
      ];

      // Get total count for pagination
      const countPipeline = [
        { $match: searchArgs },
        {
          $count: 'total',
        },
      ];

      const [postsResult, countResult] = await Promise.all([
        PostModel.aggregate(aggregationPipeline),
        PostModel.aggregate(countPipeline),
      ]);

      trendingPosts = postsResult;
      totalPosts = countResult.length > 0 ? countResult[0].total : 0;
    } else {
      // Original logic for when interactions is false
      totalPosts = await PostModel.find(searchArgs).count();

      // Build sort criteria with configurable direction
      const sortCriteria = {
        created: sortOrder === 'asc' ? 'asc' : 'desc', // Use sortOrder parameter
      };

      console.log('Search query details:', {
        searchKey,
        searchKeyTrimmed: searchKey ? searchKey.trim() : null,
        searchArgs,
        offset,
        limit,
        totalPosts,
        sortCriteria,
        sortOrder,
        filtersApplied: {
          friendsOnly,
          interactions,
          dateRange: !!(startDateRange || endDateRange),
          search: !!(searchKey && searchKey.trim()),
          userId: !!userId,
        },
      });

      console.log('topPosts - Final searchArgs:', searchArgs);
      console.log('topPosts - userId being filtered:', userId);

      trendingPosts = await PostModel.find(searchArgs)
        .sort(sortCriteria)
        .skip(offset)
        .limit(limit);

      console.log('topPosts - Posts found:', trendingPosts.length);
      console.log(
        'topPosts - First few posts userIds:',
        trendingPosts.slice(0, 3).map((p) => p.userId),
      );
    }

    // Populate creator information
    const postsWithCreator = await Promise.all(
      trendingPosts.map(async (post) => {
        const creator = await UserModel.findById(post.userId);
        // Handle both mongoose documents and aggregation results
        const postObj = post.toObject ? post.toObject() : post;
        return {
          ...postObj,
          creator: creator
            ? {
              _id: creator._id, // eslint-disable-line no-underscore-dangle
              name: creator.name,
              username: creator.username,
              avatar: creator.avatar,
            }
            : null,
          votedBy: Array.isArray(postObj.votedBy)
            ? postObj.votedBy.map((v) => (v.userId ? v.userId.toString() : v))
            : [],
        };
      }),
    );

    return {
      entities: postsWithCreator,
      pagination: {
        total_count: totalPosts,
        limit,
        offset,
      },
    };
  };
};

export default topPosts;
import mongoose from 'mongoose'
import PostModel from '../../models/PostModel'
import UserModel from '../../models/UserModel'

export const getFeaturedPosts = () => {
  return async (_, args, context) => {
    const {
      limit = 10,
      offset = 0,
      searchKey,
      startDateRange,
      endDateRange,
      friendsOnly,
      groupId,
      userId,
      approved,
      deleted,
      interactions,
      sortOrder,
    } = args

    // Build search arguments - always include featured slot requirement and exclude deleted posts
    const searchArgs = {
      featuredSlot: { $ne: null },
      deleted: { $ne: true }, // Exclude deleted posts
    }

    // Handle text search - can be combined with other filters
    if (searchKey && searchKey.trim()) {
      searchArgs.$or = [
        { title: { $regex: searchKey.trim(), $options: 'i' } },
        { text: { $regex: searchKey.trim(), $options: 'i' } },
      ]
    }

    // Handle date range filter
    if (startDateRange && endDateRange) {
      const inclusiveEndDate = new Date(endDateRange)
      inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1)
      searchArgs.pointTimestamp = {
        $gte: new Date(startDateRange),
        $lte: new Date(inclusiveEndDate),
      }
    } else if (startDateRange) {
      searchArgs.pointTimestamp = {
        $gte: new Date(startDateRange),
      }
    } else if (endDateRange) {
      const inclusiveEndDate = new Date(endDateRange)
      inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1)

      searchArgs.pointTimestamp = {
        $lt: inclusiveEndDate, // Use $lt (less than)
      }
    }

    // Handle groupId filter
    if (groupId) {
      searchArgs.groupId = groupId
    }

    // Handle userId filter
    if (userId) {
      const userIdToFilter = mongoose.Types.ObjectId.isValid(userId)
        ? mongoose.Types.ObjectId(userId)
        : userId
      searchArgs.userId = userIdToFilter
    } else if (friendsOnly) {
      if (!context.user || !context.user._id) {
        return {
          entities: [],
          pagination: {
            total_count: 0,
            limit,
            offset,
          },
        }
      }

      const currentUser = await UserModel.findById(context.user._id)
      if (
        currentUser &&
        currentUser._followingId &&
        currentUser._followingId.length > 0
      ) {
        searchArgs.userId = {
          $in: currentUser._followingId,
        }
      } else {
        return {
          entities: [],
          pagination: {
            total_count: 0,
            limit,
            offset,
          },
        }
      }
    }

    // Handle approved filter
    if (approved !== undefined && approved !== null) {
      searchArgs.approved = approved
    }

    // Handle deleted filter
    if (deleted !== undefined && deleted !== null) {
      searchArgs.deleted = deleted
    }

    // Determine sort direction based on sortOrder parameter
    const sortDirection = sortOrder === 'asc' ? 1 : -1

    let featuredPosts
    let totalPosts

    if (interactions) {
      // Use aggregation for interactions sorting with proper lookups
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
            featuredSlot: 1,
            created: sortDirection,
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
      ]

      // Get total count for pagination
      const countPipeline = [
        { $match: searchArgs },
        {
          $count: 'total',
        },
      ]

      const [postsResult, countResult] = await Promise.all([
        PostModel.aggregate(aggregationPipeline),
        PostModel.aggregate(countPipeline),
      ])

      featuredPosts = postsResult
      totalPosts = countResult.length > 0 ? countResult[0].total : 0
    } else {
      // Simple query with proper indexing
      totalPosts = await PostModel.find(searchArgs).count()

      const sortCriteria = {
        featuredSlot: 1,
        created: sortOrder === 'asc' ? 'asc' : 'desc',
      }

      featuredPosts = await PostModel.find(searchArgs)
        .sort(sortCriteria)
        .skip(offset)
        .limit(limit)
    }

    // Optimize creator population using aggregation instead of N+1 queries
    if (featuredPosts.length > 0) {
      const userIds = featuredPosts.map((post) => post.userId || post.userId)
      const uniqueUserIds = [...new Set(userIds)]

      // Fetch all creators in one query
      const creators = await UserModel.find({
        _id: { $in: uniqueUserIds },
      }).select('_id name username avatar')

      // Create a map for fast lookup
      const creatorMap = new Map()
      creators.forEach((creator) => {
        creatorMap.set(creator._id.toString(), creator)
      })

      // Populate creator information efficiently
      const postsWithCreator = featuredPosts.map((post) => {
        const postObj = post.toObject ? post.toObject() : post
        const creator = creatorMap.get((post.userId || post.userId).toString())

        return {
          ...postObj,
          creator: creator
            ? {
                _id: creator._id,
                name: creator.name,
                username: creator.username,
                avatar: creator.avatar,
              }
            : null,
          votedBy: Array.isArray(postObj.votedBy)
            ? postObj.votedBy.map((v) => (v.userId ? v.userId.toString() : v))
            : [],
        }
      })

      return {
        entities: postsWithCreator,
        pagination: {
          total_count: totalPosts,
          limit,
          offset,
        },
      }
    }

    return {
      entities: [],
      pagination: {
        total_count: totalPosts,
        limit,
        offset,
      },
    }
  }
}

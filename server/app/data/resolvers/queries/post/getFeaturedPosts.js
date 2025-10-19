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

    const searchArgs = {
      featuredSlot: { $ne: null },
      deleted: { $ne: true },
    }

    if (searchKey && searchKey.trim()) {
      searchArgs.$or = [
        { title: { $regex: searchKey.trim(), $options: 'i' } },
        { text: { $regex: searchKey.trim(), $options: 'i' } },
      ]
    }

    // Robust date-only parsing aligned with topPosts
    const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime())
    const parseDateOnlyStart = (s) => {
      if (!s || typeof s !== 'string') return null
      const d = new Date(`${s}T00:00:00`)
      return isValidDate(d) ? d : null
    }
    const parseDateOnlyEnd = (s) => {
      if (!s || typeof s !== 'string') return null
      const d = new Date(`${s}T23:59:59.999`)
      return isValidDate(d) ? d : null
    }
    let startDt = parseDateOnlyStart(startDateRange)
    let endDt = parseDateOnlyEnd(endDateRange)
    if (startDt && endDt && startDt.getTime() > endDt.getTime()) {
      const tmp = startDt
      startDt = endDt
      endDt = tmp
    }
    if (startDt && endDt) {
      searchArgs.pointTimestamp = { $gte: startDt, $lte: endDt }
    } else if (startDt) {
      searchArgs.pointTimestamp = { $gte: startDt }
    } else if (endDt) {
      searchArgs.pointTimestamp = { $lte: endDt }
    }

    if (groupId) {
      searchArgs.groupId = groupId
    }

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

    if (approved !== undefined && approved !== null) {
      let approvedValue = approved
      if (typeof approved === 'boolean') {
        approvedValue = approved ? 1 : 0
      }
      searchArgs.approved = approvedValue
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
        { $skip: offset },
        { $limit: limit },
      ]

      const countPipeline = [{ $match: searchArgs }, { $count: 'total' }]

      const [postsResult, countResult] = await Promise.all([
        PostModel.aggregate(aggregationPipeline),
        PostModel.aggregate(countPipeline),
      ])

      featuredPosts = postsResult
      totalPosts = countResult.length > 0 ? countResult[0].total : 0
    } else {
      totalPosts = await PostModel.countDocuments(searchArgs)

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

export default getFeaturedPosts

import mongoose from 'mongoose'
import PostModel from '../../models/PostModel'
import UserModel from '../../models/UserModel'

export const topPosts = () => {
  return async (_, args, context) => {
    try {
      console.log('topPosts - Starting query with args:', args)
      console.log(
        'topPosts - Context user:',
        context.user ? 'Authenticated' : 'Not authenticated',
      )

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
      } = args

      // Normalize pagination with safe defaults and clamping
      const rawLimit = Number.isFinite(Number(limit)) ? Number(limit) : 20
      const rawOffset = Number.isFinite(Number(offset)) ? Number(offset) : 0
      const safeLimit = Math.max(1, Math.min(100, Math.trunc(rawLimit)))
      const safeOffset = Math.max(0, Math.trunc(rawOffset))

      console.log('topPosts - Validated parameters:', {
        limit: safeLimit,
        offset: safeOffset,
        searchKey,
        friendsOnly,
        interactions,
        sortOrder,
      })

      // Build search arguments
      const searchArgs = {
        deleted: { $ne: true }, // Exclude deleted posts
      }

      // Handle text search - can be combined with other filters
      if (searchKey && searchKey.trim()) {
        searchArgs.$or = [
          { title: { $regex: searchKey.trim(), $options: 'i' } },
          { text: { $regex: searchKey.trim(), $options: 'i' } },
        ]
      }

      // Helpers for robust date-only parsing (treat yyyy-MM-dd as local day)
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

      // Handle date range filter - can be combined with search and friendsOnly
      let startDt = parseDateOnlyStart(startDateRange)
      let endDt = parseDateOnlyEnd(endDateRange)
      // If start > end, swap to avoid empty ranges
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

      // Handle groupId filter - can be combined with other filters
      if (groupId) {
        searchArgs.groupId = mongoose.Types.ObjectId.isValid(groupId)
          ? mongoose.Types.ObjectId(groupId)
          : groupId
      }

      // Handle userId filter - if userId is provided, only return posts for that user
      if (userId) {
        console.log('topPosts - userId filter applied:', userId)
        console.log('topPosts - userId type:', typeof userId)

        // Convert userId to ObjectId if it's a string to ensure proper matching
        const userIdToFilter = mongoose.Types.ObjectId.isValid(userId)
          ? mongoose.Types.ObjectId(userId)
          : userId

        searchArgs.userId = userIdToFilter

        // When filtering by specific userId, ignore friendsOnly filter
        // This ensures we get all posts for the specified user
        console.log('topPosts - searchArgs with userId:', searchArgs)
      } else if (friendsOnly) {
        // Handle friendsOnly filter - only apply when no specific userId is requested
        if (!context.user || !context.user._id) {
          // eslint-disable-line no-underscore-dangle
          // If friendsOnly is requested but no user context, return empty results
          return {
            entities: [],
            pagination: {
              total_count: 0,
              limit: safeLimit,
              offset: safeOffset,
            },
          }
        }

        // Get the current user's following list
        const currentUser = await UserModel.findById(
          context.user._id, // eslint-disable-line no-underscore-dangle
        )
        if (
          currentUser &&
          currentUser._followingId && // eslint-disable-line no-underscore-dangle
          currentUser._followingId.length > 0 // eslint-disable-line no-underscore-dangle
        ) {
          searchArgs.userId = {
            $in: currentUser._followingId, // eslint-disable-line no-underscore-dangle
          }
        } else {
          // If user has no following, return empty results
          return {
            entities: [],
            pagination: {
              total_count: 0,
              limit: safeLimit,
              offset: safeOffset,
            },
          }
        }
      }

      // Handle approved filter - can be combined with other filters
      if (approved !== undefined && approved !== null) {
        // DB schema stores approved as Number; coerce boolean to numeric
        if (typeof approved === 'boolean') {
          searchArgs.approved = approved ? 1 : 0
        } else {
          searchArgs.approved = approved
        }
      }

      // Determine sort direction based on sortOrder parameter
      const sortDirection = sortOrder === 'asc' ? 1 : -1

      let trendingPosts
      let totalPosts

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
          { $skip: safeOffset },
          { $limit: safeLimit },
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

        trendingPosts = postsResult
        totalPosts = countResult.length > 0 ? countResult[0].total : 0
      } else {
        // Original logic for when interactions is false
        totalPosts = await PostModel.countDocuments(searchArgs)

        // Build sort criteria with configurable direction
        const sortCriteria = {
          created: sortOrder === 'asc' ? 'asc' : 'desc', // Use sortOrder parameter
        }

        console.log('Search query details:', {
          searchKey,
          searchKeyTrimmed: searchKey ? searchKey.trim() : null,
          searchArgs,
          offset: safeOffset,
          limit: safeLimit,
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
        })

        console.log('topPosts - Final searchArgs:', searchArgs)
        console.log('topPosts - userId being filtered:', userId)

        trendingPosts = await PostModel.find(searchArgs)
          .sort(sortCriteria)
          .skip(safeOffset)
          .limit(safeLimit)

        console.log('topPosts - Posts found:', trendingPosts.length)
        console.log(
          'topPosts - First few posts userIds:',
          trendingPosts.slice(0, 3).map((p) => p.userId),
        )
      }

      // Populate creator information efficiently (batch fetch to avoid N+1)
      let postsWithCreator = []
      if (trendingPosts && trendingPosts.length > 0) {
        const userIds = trendingPosts
          .map((post) => post.userId)
          .filter((id) => !!id)
          .map((id) => (id.toString ? id.toString() : String(id)))

        const uniqueUserIds = [...new Set(userIds)]

        const creators = await UserModel.find({
          _id: { $in: uniqueUserIds },
        }).select('_id name username avatar')

        const creatorMap = new Map()
        creators.forEach((c) => {
          creatorMap.set(c._id.toString(), c)
        })

        postsWithCreator = trendingPosts.map((post) => {
          const postObj = post.toObject ? post.toObject() : post
          const creator = creatorMap.get(
            post.userId && post.userId.toString
              ? post.userId.toString()
              : String(post.userId),
          )

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
          }
        })
      }

      return {
        entities: postsWithCreator,
        pagination: {
          total_count: totalPosts,
          limit: safeLimit,
          offset: safeOffset,
        },
      }
    } catch (error) {
      console.error('topPosts - Error fetching posts:', error)
      throw new Error(`Failed to fetch posts: ${error.message}`)
    }
  }
}

export default topPosts

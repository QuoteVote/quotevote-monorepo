import { gql } from '@apollo/client'

export const GET_USER_POSTS = gql`
  query GetUserPosts(
    $limit: Int!
    $offset: Int!
    $userId: String!
    $searchKey: String! = ""
    $sortOrder: String
  ) {
    posts(
      limit: $limit
      offset: $offset
      userId: $userId
      searchKey: $searchKey
      sortOrder: $sortOrder
    ) {
      entities {
        _id
        userId
        groupId
        title
        text
        upvotes
        downvotes
        bookmarkedBy
        created
        url
        rejectedBy
        approvedBy
        creator {
          name
          username
          avatar
          _id
          contributorBadge
        }
        votes {
          _id
          type
        }
        comments {
          _id
        }
      }
      pagination {
        total_count
        limit
        offset
      }
    }
  }
`

export type UserPost = {
  _id: string
  userId: string
  groupId?: string
  title: string
  text?: string
  upvotes?: number
  downvotes?: number
  bookmarkedBy?: string[]
  created?: string
  url?: string
  rejectedBy?: string[]
  approvedBy?: string[]
  creator?: {
    _id: string
    name?: string
    username?: string
    avatar?: string
    contributorBadge?: string
  }
  votes?: Array<{ _id: string; type?: string }>
  comments?: Array<{ _id: string }>
}

export type UserPostsResponse = {
  posts: {
    entities: UserPost[]
    pagination: {
      total_count: number
      limit: number
      offset: number
    }
  }
}

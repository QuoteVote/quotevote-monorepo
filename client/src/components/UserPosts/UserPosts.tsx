"use client"

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  GET_USER_POSTS,
  type UserPost,
  type UserPostsResponse,
} from '@/graphql/queries/userPosts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Button from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type UserPostsProps = {
  userId: string
  pageSize?: number
  className?: string
}

type PaginationInfo = {
  total_count: number
  limit: number
  offset: number
}

function formatDate(isoDate?: string): string {
  if (!isoDate) return 'Unknown date'
  const date = new Date(isoDate)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function PostCard({ post }: { post: UserPost }) {
  const commentCount = post.comments?.length ?? 0
  const voteTotal = (post.upvotes ?? 0) - (post.downvotes ?? 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          {post.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {post.creator?.username ? `@${post.creator.username}` : 'Unknown author'} · {formatDate(post.created)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {post.text && (
          <p className="text-sm leading-relaxed text-foreground/80 line-clamp-4">{post.text}</p>
        )}
        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            {post.url}
          </a>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium">
            👍 {post.upvotes ?? 0}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium">
            👎 {post.downvotes ?? 0}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium">
            💬 {commentCount}
          </span>
        </div>
        <span className="text-xs font-semibold text-foreground/80">
          Score: {voteTotal}
        </span>
      </CardFooter>
    </Card>
  )
}

function LoadingList() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((key) => (
        <Card key={key} className="w-full">
          <CardHeader>
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-16" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/40 p-10 text-center">
      <div className="mb-3 text-4xl">📝</div>
      <h3 className="text-lg font-semibold text-foreground">No posts yet</h3>
      <p className="text-sm text-muted-foreground">
        This user has not published any posts.
      </p>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Alert variant="destructive" className="w-full">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export default function UserPosts({ userId, pageSize = 15, className }: UserPostsProps) {
  const [page, setPage] = useState(1)

  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize])

  const { data, loading, error, refetch } = useQuery<UserPostsResponse>(GET_USER_POSTS, {
    variables: {
      limit: pageSize,
      offset,
      userId,
      searchKey: '',
      sortOrder: 'new',
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [userId, pageSize])

  const posts = data?.posts.entities ?? []
  const pagination: PaginationInfo = data?.posts.pagination ?? {
    limit: pageSize,
    offset,
    total_count: 0,
  }

  const totalPages = Math.max(1, Math.ceil((pagination.total_count ?? 0) / pageSize))

  const handleNext = () => {
    setPage((current) => Math.min(totalPages, current + 1))
  }

  const handlePrev = () => {
    setPage((current) => Math.max(1, current - 1))
  }

  const handleRefresh = () => {
    refetch()
  }

  return (
    <section className={cn('flex w-full flex-col gap-6', className)}>
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Posts</p>
          <h2 className="text-xl font-semibold text-foreground">User activity</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      </header>

      {loading && !posts.length ? <LoadingList /> : null}

      {error ? (
        <ErrorState message={error.message} onRetry={handleRefresh} />
      ) : posts.length === 0 && !loading ? (
        <EmptyState />
      ) : null}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <a key={post._id} href={`/posts/${post._id}`} className="block">
            <PostCard post={post} />
          </a>
        ))}
      </div>

      <footer className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm">
        <div className="text-muted-foreground">
          Showing {posts.length ? pagination.offset + 1 : 0}–
          {posts.length ? pagination.offset + posts.length : 0} of {pagination.total_count ?? 0}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrev} disabled={page === 1 || loading}>
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={page >= totalPages || loading || posts.length < pageSize}
          >
            Next
          </Button>
        </div>
      </footer>
    </section>
  )
}

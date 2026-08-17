"use client"

import { useMemo } from 'react'
import UserPosts from '@/components/UserPosts'

export type UserPostsTestPageProps = {
  searchParams?: {
    userId?: string
    pageSize?: string
  }
}

export default function UserPostsTestPage({ searchParams }: UserPostsTestPageProps) {
  const userId = searchParams?.userId || ''
  const pageSize = useMemo(() => {
    const parsed = Number(searchParams?.pageSize)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 10
  }, [searchParams?.pageSize])

  if (!userId) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-4 p-6">
        <h1 className="text-2xl font-semibold text-foreground">User posts test page</h1>
        <p className="text-sm text-muted-foreground">
          Provide a <code className="rounded bg-muted px-2 py-1">userId</code> query string parameter to preview posts for a
          specific user.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <UserPosts userId={userId} pageSize={pageSize} />
    </main>
  )
}

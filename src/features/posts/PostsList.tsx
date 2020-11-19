import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { RootState } from '../../app/store'
import { selectPostsIds, fetchPosts } from './postsSlice'
import { Status } from '../../app/status'
import { PostExcerpt } from './PostExcerpt'
import { EntityId } from '@reduxjs/toolkit'

export const PostsList = () => {
  const dispatch = useDispatch()
  const orderedPostIds: EntityId[] = useSelector(selectPostsIds)

  const postStatus = useSelector((state: RootState) => state.posts.status)
  const error = useSelector((state: RootState) => state.posts.error)

  useEffect(() => {
    if (postStatus === Status.IDLE) {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  const content = (() => {
    switch (postStatus) {
      case Status.LOADING:
        return <div className="loader">Loading&hellip;</div>
      case Status.SUCCEEDED:
        return orderedPostIds.map(postId => (
          <PostExcerpt key={postId} postId={postId} />
        ))
      case Status.FAILED:
        return <div>{error}</div>
      default:
        return <span></span>
    }
  })()

  return (
    <section className="post-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
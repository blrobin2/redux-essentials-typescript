import React, { useState, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, RouteComponentProps } from 'react-router-dom'

import { postUpdated, selectPostById, Post } from './postsSlice'
import { RootState } from '../../app/store'

export const EditPostForm = ({ match }: RouteComponentProps<{ postId: string }>) => {
  const { postId } = match.params
  const post = useSelector<RootState, Post | undefined>(state => selectPostById(state, postId))
  const [title, setTitle] = useState(post ? post.title: '')
  const [content, setContent] = useState(post ? post.content : '')

  const dispatch = useDispatch()
  const history = useHistory()

  if (!post) {
    return (
      <section>
        <h2>Post Not Found</h2>
      </section>
    )
  }

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value)

  const onSavePostClicked = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (title && content) {
      dispatch(postUpdated({
        id: postId,
        title,
        content
      }))
      history.push(`/posts`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="submit">
          Save Post
        </button>
      </form>
    </section>
  )
}
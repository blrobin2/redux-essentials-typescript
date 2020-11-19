import React, { useState, ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch } from '../../app/store'
import { addNewPost } from './postsSlice'
import { Status } from '../../app/status'
import { selectAllUsers } from '../users/usersSlice'
import { unwrapResult } from '@reduxjs/toolkit'

export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState(Status.IDLE)

  const dispatch: AppDispatch = useDispatch()
  const users = useSelector(selectAllUsers)

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value)
  const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value)

  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === Status.IDLE

  const onSavePostClicked = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (canSave) {
      try {
        setAddRequestStatus(Status.LOADING)
        const resultAction = await dispatch(addNewPost({
          title,
          content,
          user: userId
        }))
        unwrapResult(resultAction)
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save post: ', err)
      } finally {
        setAddRequestStatus(Status.IDLE)
      }
    }
  }

  const userOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {userOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button
          type="submit"
          disabled={!canSave}
        >
          Save Post
        </button>
      </form>
    </section>
  )
}
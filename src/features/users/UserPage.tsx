import React from 'react'
import { useSelector } from 'react-redux'
import { Link, RouteComponentProps } from 'react-router-dom'

import { selectUserById, User } from './usersSlice'
import { RootState } from '../../app/store'
import { selectPostsByUser, Post } from '../posts/postsSlice'

export const UserPage = ({ match }: RouteComponentProps<{ userId: string }>) => {
  const { userId } = match.params

  const user = useSelector<RootState, User | undefined>(state => selectUserById(state, userId))
  const postsForUser = useSelector<RootState, Post[]>(state => selectPostsByUser(state, userId))

  if (!user) {
    return (
      <section>
        <h2>User Not Found</h2>
      </section>
    )
  }

  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  )
}
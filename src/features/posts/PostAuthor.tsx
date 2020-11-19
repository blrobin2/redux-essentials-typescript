import React from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../app/store'
import { selectUserById } from '../users/usersSlice'
import { EntityId } from '@reduxjs/toolkit'

export const PostAuthor = ({ userId }: { userId: EntityId }) => {
  const author = useSelector((state: RootState) => selectUserById(state, userId))

  return <span>by {author ? author.name : 'Unknown Author'}</span>
}
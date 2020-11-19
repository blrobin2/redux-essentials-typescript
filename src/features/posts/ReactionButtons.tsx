import React from 'react'
import { useDispatch } from 'react-redux'

import { reactionAdded, AvailableReaction, Post } from './postsSlice'

const reactionEmoji: { [key in AvailableReaction]: string } = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
}

export const ReactionButtons = ({ post }: { post: Post }) => {
  const dispatch = useDispatch()

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    const onReactionClicked = () => dispatch(reactionAdded(post.id, name as AvailableReaction))
    return (
      <button
        key={name}
        type="button"
        className="muted-button reaction-button"
        onClick={onReactionClicked}
      >
        {emoji} {post.reactions[name as AvailableReaction]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
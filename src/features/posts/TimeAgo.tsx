import React from 'react'
import { parseISO, formatDistanceToNow } from 'date-fns'

export const TimeAgo = ({ timestamp }: { timestamp: string | undefined }) => {
  const timeAgo: string = (() => {
    if (timestamp) {
      const date = parseISO(timestamp)
      const timePeriod = formatDistanceToNow(date)
      return `${timePeriod} ago`
    }
    return ''
  })()

  return (
    <span title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </span>
  )
}
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import {
  selectAllNotifications,
  allNotificationsRead,
  Notification
} from './notificationsSlice'
import { selectAllUsers } from '../users/usersSlice'

export const NotificationsList = () => {
  const dispatch = useDispatch()
  const notifications: Notification[] = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)

  useEffect(() => {
    dispatch(allNotificationsRead({}))
  })

  const renderedNotifications = notifications.map((notification: Notification) => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find(user => user.id === notification.user) || {
      name: 'Unknown User'
    }

    const notificationClassname = classnames('notification', {
      new: notification.isNew
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <strong>{user.name}</strong> {notification.message}
        </div>
        <div title={notification.date}>
          <em>{timeAgo} ago</em>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  EntityId,
  EntityState,
  SliceCaseReducers
} from '@reduxjs/toolkit'
import { RootState, AppDispatch } from '../../app/store'

import { client } from '../../api/client'

export interface Notification {
  id: EntityId
  date: string
  message: string
  user: number
  read: boolean
  isNew: boolean
}

const notificationsAdatper = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  {
    dispatch: AppDispatch,
    state: RootState
  }
>('notifications/fetchNotifications', async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )

    return response.notifications as Notification[]
  }
)

const notificationsSlice = createSlice<EntityState<Notification>, SliceCaseReducers<EntityState<Notification>>, 'notifications'>({
  name: 'notifications',
  initialState: notificationsAdatper.getInitialState(),
  reducers: {
    allNotificationsRead(state: EntityState<Notification>) {
      Object.values(state.entities).forEach((notification: Notification | undefined) => {
        if (notification) {
          notification.read = true
        }
      })
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      Object.values(state.entities).forEach(notification => {
        if (notification) {
          notification.isNew = !notification.read
        }
      })
      notificationsAdatper.upsertMany(state, action.payload)
    })
  }
})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const {
  selectAll: selectAllNotifications
} = notificationsAdatper.getSelectors<RootState>((state) => state.notifications)

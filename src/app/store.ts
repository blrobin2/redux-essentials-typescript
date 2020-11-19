import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import usersReducer from '../features/users/usersSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
import postsReducer from '../features/posts/postsSlice'

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    users: usersReducer,
    posts: postsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export type AppDispatch = typeof store.dispatch

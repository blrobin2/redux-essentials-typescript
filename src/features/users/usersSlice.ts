import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  EntityState,
  EntityId
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../app/store'

export interface User {
  id: EntityId
  firstName: string
  lastName: string
  name: string
  username: string
}

const usersAdapter = createEntityAdapter<User>()

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers', async () => {
    const response = await client.get('/fakeApi/users')
    return response.users as User[]
  }
)

const usersSlice = createSlice<EntityState<User>, {}, "users">({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  }
})

export default usersSlice.reducer

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById
} = usersAdapter.getSelectors<RootState>(state => state.users)

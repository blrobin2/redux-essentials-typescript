import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  createSelector,
  PayloadAction,
  EntityId
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { Status } from '../../app/status'
import { RootState } from '../../app/store'

export interface Reactions {
  thumbsUp: number
  hooray: number
  heart: number
  rocket: number
  eyes: number
}

export type AvailableReaction = keyof Reactions

export interface Post {
  id: EntityId
  title: string
  date: string
  content: string
  user: string
  reactions: Reactions
}

export interface AddPostBody {
  title: string
  content: string
  user: string
}

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState<{status: Status, error: string | null}>({
  status: Status.IDLE,
  error: null
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
  try {
    const response = await client.get('/fakeApi/posts')
    return response.posts as Post[]
  } catch (err) {
    return rejectWithValue(err.message);
  }
})

export const addNewPost = createAsyncThunk('/posts/addNewPost', async (initialPost: AddPostBody) => {
  const response = await client.post('/fakeApi/posts', { post: initialPost })
  return response.post as Post
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded: {
      reducer(state, action: PayloadAction<{ postId: EntityId, reaction: AvailableReaction }>) {
        const { postId, reaction } = action.payload
        const existingPost = state.entities[postId]
        if (existingPost) {
          existingPost.reactions[reaction]++
        }
      },
      prepare(postId: EntityId, reaction: AvailableReaction) {
        return {
          payload: {
            postId,
            reaction
          },
          error: null,
          meta: null
        }
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchPosts.pending, state => {
      state.status = Status.LOADING
    })
    builder.addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
      state.status = Status.SUCCEEDED
      postsAdapter.upsertMany(state, action.payload)
    })
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.status = Status.FAILED
      state.error = action.payload as string
    })
    builder.addCase(addNewPost.fulfilled, postsAdapter.addOne)
  }
})

export const {
  postUpdated,
  reactionAdded
} = postsSlice.actions

export default postsSlice.reducer

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostsIds
} = postsAdapter.getSelectors<RootState>(state => state.posts)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_state: RootState, userId: EntityId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)
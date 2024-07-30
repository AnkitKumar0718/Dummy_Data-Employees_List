import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  status: 'idle',
  error: null,
  hasMore: true,
  filters: {
    gender: '',
    country: '',
  },
  sortConfig: {
    key: null,
    direction: null,
  },
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ limit, skip }) => {
    const response = await axios.get(`https://dummyjson.com/users`, {
      params: { limit, skip },
    });
    return response.data.users;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSort: (state, action) => {
      state.sortConfig = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = [...state.users, ...action.payload];
        if (action.payload.length < 10) {
          state.hasMore = false;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setFilter, setSort } = usersSlice.actions;
export default usersSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPlaylists, createPlaylist as apiCreate, deletePlaylist as apiDelete } from '../../services/api';

export const fetchPlaylists = createAsyncThunk('playlist/fetchAll', async () => {
  const res = await getPlaylists();
  return res.data;
});

export const createPlaylist = createAsyncThunk('playlist/create', async (data) => {
  const res = await apiCreate(data);
  return res.data;
});

export const removePlaylist = createAsyncThunk('playlist/remove', async (id) => {
  await apiDelete(id);
  return id;
});

const playlistSlice = createSlice({
  name: 'playlist',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending,   (state)         => { state.loading = true; })
      .addCase(fetchPlaylists.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(createPlaylist.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(removePlaylist.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      });
  },
});

export default playlistSlice.reducer;
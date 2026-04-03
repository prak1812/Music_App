import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPlaylists, createPlaylist as apiCreate, deletePlaylist as apiDelete } from '../../services/api';

export const fetchPlaylists = createAsyncThunk('playlist/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await getPlaylists();
    // Handle both shapes: array directly OR { playlists: [] }
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.playlists)) return data.playlists;
    return [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch playlists');
  }
});

export const createPlaylist = createAsyncThunk('playlist/create', async (data, { rejectWithValue }) => {
  try {
    const res = await apiCreate(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create playlist');
  }
});

export const removePlaylist = createAsyncThunk('playlist/remove', async (id, { rejectWithValue }) => {
  try {
    await apiDelete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete playlist');
  }
});

const playlistSlice = createSlice({
  name: 'playlist',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending,   (state)         => { state.loading = true;  state.error = null; })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.items   = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPlaylists.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
        state.items   = []; // ensure items is never undefined
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        if (action.payload?._id) state.items.push(action.payload);
      })
      .addCase(removePlaylist.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      });
  },
});

export default playlistSlice.reducer;
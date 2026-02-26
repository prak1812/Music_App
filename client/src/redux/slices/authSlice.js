import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch {
    return rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, initialized: false },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending,    (state)         => { state.loading = true;  state.error = null; })
      .addCase(login.fulfilled,  (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(login.rejected,   (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.pending,    (state)         => { state.loading = true;  state.error = null; })
      .addCase(register.fulfilled,  (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(register.rejected,   (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload;  state.initialized = true; })
      .addCase(fetchMe.rejected,  (state)         => { state.initialized = true; });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
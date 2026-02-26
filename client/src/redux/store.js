import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './slices/authSlice';
import playerReducer   from './slices/playerSlice';
import playlistReducer from './slices/playlistSlice';

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    player:   playerReducer,
    playlist: playlistReducer,
  },
});
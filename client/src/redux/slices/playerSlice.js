import { createSlice } from '@reduxjs/toolkit';

const playerSlice = createSlice({
  name: 'player',
  initialState: {
    currentSong:  null,
    queue:        [],
    currentIndex: 0,
    isPlaying:    false,
    volume:       0.8,
    isShuffle:    false,
    repeatMode:   'none',
    progress:     0,
    duration:     0,
  },
  reducers: {
    setCurrentSong(state, action) {
      state.currentSong  = action.payload.song;
      state.queue        = action.payload.queue || [action.payload.song];
      state.currentIndex = action.payload.index || 0;
      state.isPlaying    = true;
      state.progress     = 0;
    },
    togglePlay(state) {
      state.isPlaying = !state.isPlaying;
    },
    setVolume(state, action) {
      state.volume = action.payload;
    },
    toggleShuffle(state) {
      state.isShuffle = !state.isShuffle;
    },
    cycleRepeat(state) {
      const modes = ['none', 'all', 'one'];
      const idx   = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(idx + 1) % 3];
    },
    setProgress(state, action) {
      state.progress = action.payload;
    },
    setDuration(state, action) {
      state.duration = action.payload;
    },
    playNext(state) {
      if (state.isShuffle) {
        state.currentIndex = Math.floor(Math.random() * state.queue.length);
      } else if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
      } else if (state.repeatMode === 'all') {
        state.currentIndex = 0;
      } else {
        state.isPlaying = false;
        return;
      }
      state.currentSong = state.queue[state.currentIndex];
      state.progress    = 0;
    },
    playPrev(state) {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentSong   = state.queue[state.currentIndex];
        state.progress      = 0;
      }
    },
  },
});

export const {
  setCurrentSong, togglePlay, setVolume, toggleShuffle,
  cycleRepeat, setProgress, setDuration, playNext, playPrev,
} = playerSlice.actions;

export default playerSlice.reducer;
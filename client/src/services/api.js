import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) localStorage.removeItem('token');
    return Promise.reject(err);
  }
);

export default api;

export const getSongs        = (params) => api.get('/songs', { params });
export const getSong         = (id)     => api.get(`/songs/${id}`);
export const searchSongs     = (q)      => api.get('/songs/search', { params: { q } });
export const uploadSong      = (data)   => api.post('/songs', data);
export const toggleLike      = (id)     => api.post(`/songs/${id}/like`);
export const downloadSong    = (id)     => api.get(`/songs/${id}/download`);
export const deleteSong      = (id)     => api.delete(`/songs/${id}`);

export const getPlaylists         = ()           => api.get('/playlists');
export const getPlaylist          = (id)         => api.get(`/playlists/${id}`);
export const createPlaylist       = (data)       => api.post('/playlists', data);
export const updatePlaylist       = (id, data)   => api.put(`/playlists/${id}`, data);
export const deletePlaylist       = (id)         => api.delete(`/playlists/${id}`);
export const addSongToPlaylist    = (pid, sid)   => api.post(`/playlists/${pid}/songs`, { songId: sid });
export const removeSongFromPlaylist = (pid, sid) => api.delete(`/playlists/${pid}/songs/${sid}`);

export const getSongComments = (songId) => api.get(`/comments/song/${songId}`);
export const addComment      = (data)   => api.post('/comments', data);
export const deleteComment   = (id)     => api.delete(`/comments/${id}`);

export const getLikedSongs  = ()     => api.get('/users/liked');
export const updateProfile  = (data) => api.put('/users/profile', data);
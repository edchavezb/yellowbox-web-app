import { QueueItem, Artist, Album, Track, Playlist } from '../../types/interfaces'
import api from '../index'

export const getUserQueueApi = async (userId: string) => {
  try {
    return await api.get<QueueItem[]>(`users/${userId}/queue`, {})
  }
  catch (err) {
    console.log(err)
    throw err;
  }
}

export const addArtistToQueueApi = async (userId: string, artist: Artist) => {
  try {
    return await api.post<{ newArtist: Artist }, { message: string }>(`users/${userId}/queue/artists`, { newArtist: artist });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const addAlbumToQueueApi = async (userId: string, album: Album) => {
  try {
    return await api.post<{ newAlbum: Album }, { message: string }>(`users/${userId}/queue/albums`, { newAlbum: album });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const addTrackToQueueApi = async (userId: string, track: Track) => {
  try {
    return await api.post<{ newTrack: Track }, { message: string }>(`users/${userId}/queue/tracks`, { newTrack: track });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const addPlaylistToQueueApi = async (userId: string, playlist: Playlist) => {
  try {
    return await api.post<{ newPlaylist: Playlist }, { message: string }>(`users/${userId}/queue/playlists`, { newPlaylist: playlist });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeArtistFromQueueApi = async (userId: string, spotifyId: string) => {
  try {
    return await api.delete<{ message: string }>(`users/${userId}/queue/artists/${spotifyId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeAlbumFromQueueApi = async (userId: string, spotifyId: string) => {
  try {
    return await api.delete<{ message: string }>(`users/${userId}/queue/albums/${spotifyId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeTrackFromQueueApi = async (userId: string, spotifyId: string) => {
  try {
    return await api.delete<{ message: string }>(`users/${userId}/queue/tracks/${spotifyId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removePlaylistFromQueueApi = async (userId: string, spotifyId: string) => {
  try {
    return await api.delete<{ message: string }>(`users/${userId}/queue/playlists/${spotifyId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const reorderQueueItemApi = async (userId: string, itemId: string, destinationId: string) => {
  try {
    return await api.put<{ destinationId: string }, { message: string }>(`users/${userId}/queue/${itemId}/reorder`, { destinationId });
  } catch (err) {
    console.log(err);
    throw err;
  }
}
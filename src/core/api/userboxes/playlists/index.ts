import api from "core/api"
import { Playlist, UserBox } from "core/types/interfaces"

export const addPlaylistToBoxApi = async (boxId: string, playlist: Playlist) => {
  try {
    return await api.post<{ newPlaylist: Playlist }, UserBox>(`boxes/${boxId}/playlists`, { newPlaylist: playlist })
  }
  catch (err) {
    console.log(err)
  }
}

export const updateBoxPlaylistsApi = async (boxId: string, updatedItems: Playlist[]) => {
  try {
    return await api.put<{ updatedItems: Playlist[] }, UserBox>(`boxes/${boxId}/playlists`, {
      updatedItems
    })
  }
  catch (err) {
    console.log(err)
  }
}

export const addPlaylistToSubsectionApi = async (boxId: string, itemId: string, subsectionId: string, itemData: Playlist) => {
  try {
    return await api.put<{ subsectionId: string, itemData: Playlist }, UserBox>(`boxes/${boxId}/playlists/${itemId}/subsection`, {
      subsectionId,
      itemData
    })
  }
  catch (err) {
    console.log(err)
  }
}

export const removePlaylistFromSubsectionApi = async (boxId: string, itemId: string, spotifyId: string, subsectionId: string) => {
  try {
    return await api.put<{ subsectionId: string, spotifyId: string }, UserBox>(`boxes/${boxId}/playlist/${itemId}/subsection/remove`, {
      subsectionId,
      spotifyId
    })
  }
  catch (err) {
    console.log(err)
  }
}

export const updateBoxPlaylistApi = async (boxId: string, itemId: string, updatedItem: Playlist) => {
  try {
    return await api.put<{ updatedPlaylist: Playlist }, { updatedBox: UserBox }>(`boxes/${boxId}/playlists/${itemId}`, { updatedPlaylist: updatedItem });
  } catch (err) {
    console.log(err);
  }
}

export const removeBoxPlaylistApi = async (boxId: string, itemId: string) => {
  try {
    return await api.delete<Playlist[]>(`boxes/${boxId}/playlists/${itemId}`)
  }
  catch (err) {
    console.log(err)
  }
}

export const reorderBoxPlaylistApi = async (boxId: string, sourceIndex: number, destinationIndex: number) => {
  try {
    return await api.put<{ sourceIndex: number, destinationIndex: number }, UserBox>(`boxes/${boxId}/playlists/reorder`, { sourceIndex, destinationIndex });
  } catch (err) {
    console.log(err);
  }
}
import api from "core/api"
import { ItemImage, Playlist, Subsection, UserBox } from "core/types/interfaces"

export const updatePlaylistImagesApi = async (spotifyId: string, updatedImages: ItemImage[]) => {
  try {
    return await api.put<{ updatedImages: ItemImage[] }, { updatedBox: UserBox }>(`items/playlists/${spotifyId}/images`, { updatedImages });
  } catch (err) {
    console.log(err);
    throw err; 
  }
};

export const addPlaylistToBoxApi = async (boxId: string, playlist: Playlist) => {
  try {
    return await api.post<{ newPlaylist: Playlist }, UserBox>(`boxes/${boxId}/playlists`, { newPlaylist: playlist })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const reorderBoxPlaylistApi = async (boxId: string, boxPlaylistId: string, destinationId: string) => {
  try {
    return await api.put<{ destinationId: string }, UserBox>(`boxes/${boxId}/playlists/${boxPlaylistId}/reorder`, { destinationId });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeBoxPlaylistApi = async (boxId: string, boxPlaylistId: string) => {
  try {
    return await api.delete<UserBox>(`boxes/${boxId}/playlists/${boxPlaylistId}`)
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const addPlaylistToSubsectionApi = async (boxId: string, subsectionId: string, boxPlaylistId: string) => {
  try {
    return await api.post<{ boxPlaylistId: string }, UserBox>(`boxes/${boxId}/subsections/${subsectionId}/playlists`, {
      boxPlaylistId
    })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const reorderSubsectionPlaylistApi = async (boxId: string, subsectionId: string, boxPlaylistId: string, destinationId: string) => {
  try {
    return await api.put<{ destinationId: string }, { updatedSubsections: Subsection[] }>(
      `boxes/${boxId}/subsections/${subsectionId}/playlists/${boxPlaylistId}/reorder`,
      { destinationId }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const movePlaylistBetweenSubsectionsApi = async (boxId: string, subsectionId: string, destinationSubsectionId: string, boxItemId: string) => {
  try {
    return await api.put<{ destinationSubsectionId: string }, UserBox>(
      `boxes/${boxId}/subsections/${subsectionId}/playlists/${boxItemId}/move`,
      { destinationSubsectionId }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removePlaylistFromSubsectionApi = async (boxId: string, boxPlaylistId: string, subsectionId: string) => {
  try {
    return await api.delete<UserBox>(`boxes/${boxId}/subsections/${subsectionId}/playlists/${boxPlaylistId}`)
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const updateBoxPlaylistNoteApi = async (boxId: string, boxPlaylistId: string, note: string) => {
  try {
    return await api.put<{ note: string }, { updatedNote: string }>(
      `boxes/${boxId}/playlists/${boxPlaylistId}/note`,
      { note }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateSubsectionPlaylistNoteApi = async (
  boxId: string,
  subsectionId: string,
  boxPlaylistId: string,
  note: string
) => {
  try {
    return await api.put<{ note: string }, { updatedNote: string }>(
      `boxes/${boxId}/subsections/${subsectionId}/playlists/${boxPlaylistId}/note`,
      { note }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
import api from "core/api"
import { Album, Subsection, UserBox } from "core/types/interfaces"

export const addAlbumToBoxApi = async (boxId: string, album: Album) => {
  try {
    return await api.post<{ newAlbum: Album }, UserBox>(`boxes/${boxId}/albums`, { newAlbum: album })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const reorderBoxAlbumApi = async (boxId: string, boxAlbumId: string, destinationId: string) => {
  try {
    return await api.put<{ destinationId: string }, UserBox>(`boxes/${boxId}/albums/${boxAlbumId}/reorder`, { destinationId });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeBoxAlbumApi = async (boxId: string, boxAlbumId: string) => {
  try {
    return await api.delete<UserBox>(`boxes/${boxId}/albums/${boxAlbumId}`)
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const addAlbumToSubsectionApi = async (boxId: string,  subsectionId: string, boxAlbumId: string) => {
  try {
    return await api.post<{ boxAlbumId: string }, UserBox>(`boxes/${boxId}/subsections/${subsectionId}/albums`, {
      boxAlbumId
    })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const reorderSubsectionAlbumApi = async (boxId: string, subsectionId: string, boxAlbumId: string, destinationId: string) => {
  try {
    return await api.put<{ destinationId: string }, { updatedSubsections: Subsection[] }>(
      `boxes/${boxId}/subsections/${subsectionId}/albums/${boxAlbumId}/reorder`,
      { destinationId }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const moveAlbumBetweenSubsectionsApi = async (boxId: string, subsectionId: string, destinationSubsectionId: string, boxItemId: string) => {
  try {
    return await api.put<{ destinationSubsectionId: string }, UserBox>(
      `boxes/${boxId}/subsections/${subsectionId}/albums/${boxItemId}/move`,
      { destinationSubsectionId }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeAlbumFromSubsectionApi = async (boxId: string, subsectionId: string, boxAlbumId: string) => {
  try {
    return await api.delete<UserBox>(`boxes/${boxId}/subsections/${subsectionId}/albums/${boxAlbumId}`)
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const updateBoxAlbumNoteApi = async (boxId: string, boxAlbumId: string, note: string) => {
  try {
    return await api.put<{ note: string }, { updatedNote: string }>(
      `boxes/${boxId}/albums/${boxAlbumId}/note`,
      { note }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateSubsectionAlbumNoteApi = async (
  boxId: string,
  subsectionId: string,
  boxAlbumId: string,
  note: string
) => {
  try {
    return await api.put<{ note: string }, { updatedNote: string }>(
      `boxes/${boxId}/subsections/${subsectionId}/albums/${boxAlbumId}/note`,
      { note }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
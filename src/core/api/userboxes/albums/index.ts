import api from "core/api"
import { Album, UserBox } from "core/types/interfaces"

export const addAlbumToBoxApi = async (boxId: string, album: Album) => {
  try {
    return await api.post<{ newAlbum: Album }, UserBox>(`boxes/${boxId}/albums`, { newAlbum: album })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const updateBoxAlbumsApi = async (boxId: string, updatedItems: Album[]) => {
  try {
    return await api.put<{ updatedItems: Album[] }, UserBox>(`boxes/${boxId}/albums`, {
      updatedItems
    })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const addAlbumToSubsectionApi = async (boxId: string, itemId: string, subsectionId: string, itemData: Album) => {
  try {
    return await api.put<{ subsectionId: string, itemData: Album }, UserBox>(`boxes/${boxId}/albums/${itemId}/subsection`, {
      subsectionId,
      itemData
    })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const removeAlbumFromSubsectionApi = async (boxId: string, itemId: string, spotifyId: string, subsectionId: string) => {
  try {
    return await api.put<{ subsectionId: string, spotifyId: string }, UserBox>(`boxes/${boxId}/albums/${itemId}/subsection/remove`, {
      subsectionId,
      spotifyId
    })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const updateBoxAlbumApi = async (boxId: string, itemId: string, updatedItem: Album) => {
  try {
    return await api.put<{ updatedAlbum: Album }, { updatedBox: UserBox }>(`boxes/${boxId}/albums/${itemId}`, { updatedAlbum: updatedItem });
  } catch (err) {
    console.log(err);
    throw err; 
  }
};

export const removeBoxAlbumApi = async (boxId: string, itemId: string) => {
  try {
    return await api.delete<Album[]>(`boxes/${boxId}/albums/${itemId}`)
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const reorderBoxAlbumApi = async (boxId: string, sourceIndex: number, destinationIndex: number) => {
  try {
    return await api.put<{ sourceIndex: number, destinationIndex: number }, UserBox>(`boxes/${boxId}/albums/reorder`, { sourceIndex, destinationIndex });
  } catch (err) {
    console.log(err);
    throw err; 
  }
};
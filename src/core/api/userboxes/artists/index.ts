import api from "core/api"
import { Artist, UserBox } from "core/types/interfaces"

export const addArtistToBoxApi = async (boxId: string, artist: Artist) => {
  try {
    return await api.post<{ newArtist: Artist }, UserBox>(`boxes/${boxId}/artists`, { newArtist: artist })
  }
  catch (err) {
    console.log(err)
  }
}

export const updateBoxArtistsApi = async (boxId: string, updatedItems: Artist[]) => {
  try {
    return await api.put<{ updatedItems: Artist[] }, UserBox>(`boxes/${boxId}/artists`, {
      updatedItems
    })
  }
  catch (err) {
    console.log(err)
  }
}

export const updateBoxArtistApi = async (boxId: string, itemId: string, updatedItem: Artist) => {
  try {
    return await api.put<{ updatedArtist: Artist }, { updatedBox: UserBox }>(`boxes/${boxId}/artists/${itemId}`, { updatedArtist: updatedItem })
  }
  catch (err) {
    console.log(err)
  }
}

export const removeBoxArtistApi = async (boxId: string, itemId: string) => {
  try {
    return await api.delete<Artist[]>(`boxes/${boxId}/artists/${itemId}`)
  }
  catch (err) {
    console.log(err)
  }
}

export const addArtistToSubsectionApi = async (boxId: string, itemId: string, subsectionId: string, itemData: Artist) => {
  try {
    return await api.put<{ subsectionId: string, itemData: Artist }, UserBox>(`boxes/${boxId}/artists/${itemId}/subsection`, {
      subsectionId,
      itemData
    })
  }
  catch (err) {
    console.log(err)
  }
}

export const removeArtistFromSubsectionApi = async (boxId: string, itemId: string, spotifyId: string, subsectionId: string) => {
  try {
    return await api.put<{ subsectionId: string, spotifyId: string }, UserBox>(`boxes/${boxId}/artists/${itemId}/subsection/remove`, {
      subsectionId,
      spotifyId
    })
  }
  catch (err) {
    console.log(err)
  }
}

export const reorderBoxArtistApi = async (boxId: string, sourceIndex: number, destinationIndex: number) => {
  try {
    return await api.put<{ sourceIndex: number, destinationIndex: number }, UserBox>(`boxes/${boxId}/artists/reorder`, { sourceIndex, destinationIndex })
  }
  catch (err) {
    console.log(err)
  }
}
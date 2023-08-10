import api from "core/api"
import { Track, UserBox } from "core/types/interfaces"

export const addTrackToBoxApi = async (boxId: string, track: Track) => {
  try {
    return await api.post<{ newTrack: Track }, UserBox>(`boxes/${boxId}/tracks`, { newTrack: track })
  }
  catch (err) {
    console.log(err)
  }
}

export const updateBoxTracksApi = async (boxId: string, updatedItems: Track[]) => {
  try {
    return await api.put<{ updatedItems: Track[] }, UserBox>(`boxes/${boxId}/tracks`, {
      updatedItems
    })
  }
  catch (err) {
    console.log(err)
  }
}

export const addTrackToSubsectionApi = async (boxId: string, itemId: string, subsectionId: string, itemData: Track) => {
  try {
    return await api.put<{ subsectionId: string, itemData: Track }, UserBox>(`boxes/${boxId}/tracks/${itemId}/subsection`, {
      subsectionId,
      itemData
    })
  }
  catch (err) {
    console.log(err)
  }
}

export const removeTrackFromSubsectionApi = async (boxId: string, itemId: string, spotifyId: string, subsectionId: string) => {
  try {
    return await api.put<{ subsectionId: string, spotifyId: string }, UserBox>(`boxes/${boxId}/tracks/${itemId}/subsection/remove`, {
      subsectionId,
      spotifyId
    })
  }
  catch (err) {
    console.log(err)
  }
}

export const updateBoxTrackApi = async (boxId: string, itemId: string, updatedItem: Track) => {
  try {
    return await api.put<{ updatedTrack: Track }, { updatedBox: UserBox }>(`boxes/${boxId}/tracks/${itemId}`, { updatedTrack: updatedItem });
  } catch (err) {
    console.log(err);
  }
}

export const removeBoxTrackApi = async (boxId: string, itemId: string) => {
  try {
    return await api.delete<Track[]>(`boxes/${boxId}/tracks/${itemId}`)
  }
  catch (err) {
    console.log(err)
  }
}

export const reorderBoxTrackApi = async (boxId: string, sourceIndex: number, destinationIndex: number) => {
  try {
    return await api.put<{ sourceIndex: number, destinationIndex: number }, UserBox>(`boxes/${boxId}/tracks/reorder`, { sourceIndex, destinationIndex });
  } catch (err) {
    console.log(err);
  }
}
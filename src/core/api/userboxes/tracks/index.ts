import api from "core/api"
import { Subsection, Track, UserBox } from "core/types/interfaces"

export const addTrackToBoxApi = async (boxId: string, track: Track) => {
  try {
    return await api.post<{ newTrack: Track }, UserBox>(`boxes/${boxId}/tracks`, { newTrack: track })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const reorderBoxTrackApi = async (boxId: string, boxTrackId: string, destinationId: string) => {
  try {
    return await api.put<{ destinationId: string }, UserBox>(`boxes/${boxId}/tracks/${boxTrackId}/reorder`, { destinationId });
  } catch (err) {
    console.log(err);
    throw err; 
  }
}

export const removeBoxTrackApi = async (boxId: string, boxTrackId: string) => {
  try {
    return await api.delete<UserBox>(`boxes/${boxId}/tracks/${boxTrackId}`)
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const addTrackToSubsectionApi = async (boxId: string, subsectionId: string, boxTrackId: string) => {
  try {
    return await api.post<{ boxTrackId: string }, UserBox>(`boxes/${boxId}/subsections/${subsectionId}/tracks`, {
      boxTrackId
    })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const reorderSubsectionTrackApi = async (boxId: string, subsectionId: string, boxTrackId: string, destinationId: string) => {
  try {
    return await api.put<{ destinationId: string }, { updatedSubsections: Subsection[] }>(
      `boxes/${boxId}/subsections/${subsectionId}/tracks/${boxTrackId}/reorder`,
      { destinationId }
    );
  } catch (err) {
    console.log(err);
    throw err; 
  }
}

export const moveTrackBetweenSubsectionsApi = async (boxId: string, subsectionId: string, destinationSubsectionId: string, boxItemId: string) => {
  try {
    return await api.put<{ destinationSubsectionId: string }, UserBox>(
      `boxes/${boxId}/subsections/${subsectionId}/tracks/${boxItemId}/move`,
      { destinationSubsectionId }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeTrackFromSubsectionApi = async (boxId: string, subsectionId: string, boxTrackId: string) => {
  try {
    return await api.delete<UserBox>(`boxes/${boxId}/subsections/${subsectionId}/tracks/${boxTrackId}`)
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const updateBoxTrackNoteApi = async (boxId: string, boxTrackId: string, note: string) => {
  try {
    return await api.put<{ note: string }, { updatedNote: string }>(
      `boxes/${boxId}/tracks/${boxTrackId}/note`,
      { note }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateSubsectionTrackNoteApi = async (
  boxId: string,
  subsectionId: string,
  boxTrackId: string,
  note: string
) => {
  try {
    return await api.put<{ note: string }, { updatedNote: string }>(
      `boxes/${boxId}/subsections/${subsectionId}/tracks/${boxTrackId}/note`,
      { note }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
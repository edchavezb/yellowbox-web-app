import api from "core/api"
import { Artist, ItemImage, Subsection, UserBox } from "core/types/interfaces"

export const updateArtistImagesApi = async (spotifyId: string, updatedImages: ItemImage[]) => {
  try {
    return await api.put<{ updatedImages: ItemImage[] }, { updatedBox: UserBox }>(`artists/${spotifyId}/images`, { updatedImages });
  } catch (err) {
    console.log(err);
    throw err; 
  }
};

export const addArtistToBoxApi = async (boxId: string, artist: Artist) => {
  try {
    return await api.post<{ newArtist: Artist }, UserBox>(`boxes/${boxId}/artists`, { newArtist: artist })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const reorderBoxArtistApi = async (boxId: string, boxArtistId: string, destinationId: string) => {
  try {
    return await api.put<{ destinationId: string }, UserBox>(`boxes/${boxId}/artists/${boxArtistId}/reorder`, { destinationId });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeBoxArtistApi = async (boxId: string, boxArtistId: string) => {
  try {
    return await api.delete<UserBox>(`boxes/${boxId}/artists/${boxArtistId}`)
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const addArtistToSubsectionApi = async (boxId: string, subsectionId: string, boxArtistId: string) => {
  try {
    return await api.post<{ boxArtistId: string }, UserBox>(`boxes/${boxId}/subsections/${subsectionId}/artists`, {
      boxArtistId
    })
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const reorderSubsectionArtistApi = async (boxId: string, subsectionId: string, boxItemId: string, destinationId: string) => {
  try {
    return await api.put<{ destinationId: string }, { updatedSubsections: Subsection[] }>(
      `boxes/${boxId}/subsections/${subsectionId}/artists/${boxItemId}/reorder`,
      { destinationId }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeArtistFromSubsectionApi = async (boxId: string, boxArtistId: string, subsectionId: string) => {
  try {
    return await api.delete<UserBox>(`boxes/${boxId}/subsections/${subsectionId}/artists/${boxArtistId}`)
  }
  catch (err) {
    console.log(err);
    throw err; 
  }
}

export const updateBoxArtistNoteApi = async (boxId: string, boxArtistId: string, note: string) => {
  try {
    return await api.put<{ note: string }, { updatedNote: string }>(
      `boxes/${boxId}/artists/${boxArtistId}/note`,
      { note }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateSubsectionArtistNoteApi = async (
  boxId: string,
  subsectionId: string,
  boxArtistId: string,
  note: string
) => {
  try {
    return await api.put<{ note: string }, { updatedNote: string }>(
      `boxes/${boxId}/subsections/${subsectionId}/artists/${boxArtistId}/note`,
      { note }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

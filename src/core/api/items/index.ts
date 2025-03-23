import api from "core/api"
import { ItemImage, UserBox } from "core/types/interfaces";
import { ItemData } from "core/types/types";

export const updateAlbumImagesApi = async (spotifyId: string, updatedImages: ItemImage[]) => {
  try {
    return await api.put<{ updatedImages: ItemImage[] }, { updatedBox: UserBox }>(`items/albums/${spotifyId}/images`, { updatedImages });
  } catch (err) {
    console.log(err);
    throw err; 
  }
};

export const markAlbumAsPlayedApi = async (itemData: ItemData, userId: string) => {
  const { spotifyId } = itemData;
  try {
    return await api.post<{itemData: ItemData}, { message: string }>(`items/albums/${spotifyId}/played-by-user/${userId}`, {itemData});
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeAlbumPlayApi = async (spotifyId: string, userId: string) => {
  try {
    return await api.delete<{ message: string }>(`items/albums/${spotifyId}/played-by-user/${userId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const checkAlbumPlayedByUserApi = async (spotifyId: string, userId: string) => {
  try {
    return await api.get<{ played: boolean }>(`items/albums/${spotifyId}/played-by-user/${userId}`, {});
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const updateArtistImagesApi = async (spotifyId: string, updatedImages: ItemImage[]) => {
  try {
    return await api.put<{ updatedImages: ItemImage[] }, { updatedBox: UserBox }>(`items/artists/${spotifyId}/images`, { updatedImages });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const markArtistAsPlayedApi = async (itemData: ItemData, userId: string) => {
  const { spotifyId } = itemData;
  try {
    return await api.post<{itemData: ItemData}, { message: string }>(`items/artists/${spotifyId}/played-by-user/${userId}`, {itemData});
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeArtistPlayApi = async (spotifyId: string, userId: string) => {
  try {
    return await api.delete<{ message: string }>(`items/artists/${spotifyId}/played-by-user/${userId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const checkArtistPlayedByUserApi = async (spotifyId: string, userId: string) => {
  try {
    return await api.get<{ played: boolean }>(`items/artists/${spotifyId}/played-by-user/${userId}`, {});
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const updateTrackImagesApi = async (spotifyId: string, updatedImages: ItemImage[]) => {
  try {
    return await api.put<{ updatedImages: ItemImage[] }, { message: string }>(`items/tracks/${spotifyId}/images`, { updatedImages });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const markTrackAsPlayedApi = async (itemData: ItemData, userId: string) => {
  const { spotifyId } = itemData;
  try {
    return await api.post<{itemData: ItemData}, { message: string }>(`items/tracks/${spotifyId}/played-by-user/${userId}`, {itemData});
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removeTrackPlayApi = async (spotifyId: string, userId: string) => {
  try {
    return await api.delete<{ message: string }>(`items/tracks/${spotifyId}/played-by-user/${userId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const checkTrackPlayedByUserApi = async (spotifyId: string, userId: string) => {
  try {
    return await api.get<{ played: boolean }>(`items/tracks/${spotifyId}/played-by-user/${userId}`, {});
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const updatePlaylistImagesApi = async (spotifyId: string, updatedImages: ItemImage[]) => {
  try {
    return await api.put<{ updatedImages: ItemImage[] }, { message: string }>(`items/playlists/${spotifyId}/images`, { updatedImages });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const markPlaylistAsPlayedApi = async (itemData: ItemData, userId: string) => {
  const { spotifyId } = itemData;
  try {
    return await api.post<{itemData: ItemData}, { message: string }>(`items/playlists/${spotifyId}/played-by-user/${userId}`, {itemData});
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const removePlaylistPlayApi = async (spotifyId: string, userId: string) => {
  try {
    return await api.delete<{ message: string }>(`items/playlists/${spotifyId}/played-by-user/${userId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export const checkPlaylistPlayedByUserApi = async (spotifyId: string, userId: string) => {
  try {
    return await api.get<{ played: boolean }>(`items/playlists/${spotifyId}/played-by-user/${userId}`, {});
  } catch (err) {
    console.log(err);
    throw err;
  }
}
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addAlbumToQueueApi, addArtistToQueueApi, addPlaylistToQueueApi, addTrackToQueueApi, getUserQueueApi, removeAlbumFromQueueApi, removeArtistFromQueueApi, removePlaylistFromQueueApi, removeTrackFromQueueApi, reorderQueueItemApi } from "core/api/userqueue";
import { AppThunk } from "core/store/store";
import { Album, Playlist, QueueItem, Track } from "core/types/interfaces";
import { initAddToBoxToast, initErrorToast, initMarkedAsPlayedToast, initRemoveFromBoxToast } from "../toast/toastSlice";
import { markAlbumAsPlayedApi, markArtistAsPlayedApi, markPlaylistAsPlayedApi, markTrackAsPlayedApi, removeAlbumPlayApi, removeArtistPlayApi, removePlaylistPlayApi, removeTrackPlayApi } from "core/api/items";
import { ItemData } from "core/types/types";

interface UserQueueState {
  userQueue: QueueItem[];
}

const initialState: UserQueueState = {
  userQueue: [],
};

const userQueueSlice = createSlice({
  name: 'userQueue',
  initialState,
  reducers: {
    setUserQueue(state, action: PayloadAction<QueueItem[]>) {
      state.userQueue = action.payload;
    },
    updateQueueItem(state, action: PayloadAction<{ targetId: string, newItem: QueueItem }>) {
      const targetIndex = state.userQueue.findIndex(item => item.queueItemId === action.payload.targetId);
      state.userQueue[targetIndex] = action.payload.newItem;
    },
    toggleItemPlayed(state, action: PayloadAction<{ targetId: string, newPlayedStatus: boolean }>) {
      const { targetId, newPlayedStatus } = action.payload;
      const targetIndex = state.userQueue.findIndex(item => item.queueItemId === targetId);
      state.userQueue[targetIndex].playedByUser = newPlayedStatus;
    },
    addQueueItem(state, action: PayloadAction<QueueItem>) {
      state.userQueue.push(action.payload);
    },
    deleteQueueItem(state, action: PayloadAction<{ targetId: string }>) {
      const targetIndex = state.userQueue.findIndex(item => item.queueItemId === action.payload.targetId);
      if (targetIndex !== undefined) {
        state.userQueue.splice(targetIndex, 1);
      }
    }
  }
});

export const {
  setUserQueue,
  updateQueueItem,
  toggleItemPlayed,
  addQueueItem,
  deleteQueueItem
} = userQueueSlice.actions;

// Thunks for this slice
export const fetchUserQueueThunk = (userId: string): AppThunk => async (dispatch) => {
  try {
    const userQueue = await getUserQueueApi(userId);
    dispatch(setUserQueue(userQueue!));
  } catch (err) {
    dispatch(setUserQueue([]));
    dispatch(initErrorToast({ error: "Failed to fetch user queue" }));
  }
};

export const addQueueArtistThunk = (userId: string, itemData: ItemData): AppThunk => async (dispatch) => {
  try {
    const { newQueueItem } = await addArtistToQueueApi(userId, itemData);
    console.log(newQueueItem)
    dispatch(addQueueItem({...newQueueItem, itemData: itemData}))
    dispatch(initAddToBoxToast({ itemType: 'artist', isQueue: true }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to add artist to queue" }));
  }
}

export const addQueueAlbumThunk = (userId: string, itemData: ItemData): AppThunk => async (dispatch) => {
  try {
    const { newQueueItem } = await addAlbumToQueueApi(userId, itemData as Album);
    dispatch(addQueueItem({...newQueueItem, itemData: itemData}))
    dispatch(initAddToBoxToast({ itemType: 'album', isQueue: true }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to add album to queue" }));
  }
}

export const addQueueTrackThunk = (userId: string, itemData: ItemData): AppThunk => async (dispatch) => {
  try {
    const { newQueueItem } = await addTrackToQueueApi(userId, itemData as Track);
    dispatch(addQueueItem({...newQueueItem, itemData: itemData}))
    dispatch(initAddToBoxToast({ itemType: 'track', isQueue: true }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to add track to queue" }));
  }
}

export const addQueuePlaylistThunk = (userId: string, itemData: ItemData): AppThunk => async (dispatch) => {
  try {
    const { newQueueItem } = await addPlaylistToQueueApi(userId, itemData as Playlist);
    dispatch(addQueueItem({...newQueueItem, itemData: itemData}))
    dispatch(initAddToBoxToast({ itemType: 'playlist', isQueue: true }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to add playlist to queue" }));
  }
}

export const removeQueueArtistThunk = (userId: string, queueItemId: string, spotifyId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(deleteQueueItem({ targetId: queueItemId }));
    await removeArtistFromQueueApi(userId, spotifyId);
    dispatch(initRemoveFromBoxToast({ itemType: 'artist', isQueue: true }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to remove artist from queue" }));
  }
}

export const removeQueueAlbumThunk = (userId: string, queueItemId: string, spotifyId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(deleteQueueItem({ targetId: queueItemId }));
    await removeAlbumFromQueueApi(userId, spotifyId);
    dispatch(initRemoveFromBoxToast({ itemType: 'album', isQueue: true }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to remove album from queue" }));
  }
}

export const removeQueueTrackThunk = (userId: string, queueItemId: string, spotifyId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(deleteQueueItem({ targetId: queueItemId }));
    await removeTrackFromQueueApi(userId, spotifyId);
    dispatch(initRemoveFromBoxToast({ itemType: 'track', isQueue: true }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to remove track from queue" }));
  }
}

export const removeQueuePlaylistThunk = (userId: string, queueItemId: string, spotifyId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(deleteQueueItem({ targetId: queueItemId }));
    await removePlaylistFromQueueApi(userId, spotifyId);
    dispatch(initRemoveFromBoxToast({ itemType: 'playlist', isQueue: true }));
  } catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to remove playlist from queue" }));
  }
}

export const toggleQueueItemPlayedThunk = (itemData: ItemData, type: string, userId: string, newPlayedStatus: boolean): AppThunk => async (dispatch, getState) => {
  const queueItem = getState().userQueueData.userQueue.find(item => item.itemData.spotifyId === itemData.spotifyId);
  try {
    if (type === 'artist') {
      if (newPlayedStatus) {
        await markArtistAsPlayedApi(itemData, userId);
      }
      else {
        await removeArtistPlayApi(itemData.spotifyId, userId);
      }
    }
    else if (type === 'album') {
      if (newPlayedStatus) {
        await markAlbumAsPlayedApi(itemData, userId);
      }
      else {
        await removeAlbumPlayApi(itemData.spotifyId, userId);
      }
    }
    else if (type === 'track') {
      if (newPlayedStatus) {
        await markTrackAsPlayedApi(itemData, userId);
      }
      else {
        await removeTrackPlayApi(itemData.spotifyId, userId);
      }
    }
    else if (type === 'playlist') {
      if (newPlayedStatus) {
        await markPlaylistAsPlayedApi(itemData, userId);
      }
      else {
        await removePlaylistPlayApi(itemData.spotifyId, userId);
      }
    }
    dispatch(initMarkedAsPlayedToast({ itemType: type, newPlayedStatus }));
    dispatch(toggleItemPlayed({ targetId: queueItem?.queueItemId!, newPlayedStatus }));
  }
  catch (err) {
    console.log(err)
    dispatch(initErrorToast({ error: "Failed to update queue item" }));
  }
};
  

export const reorderQueueThunk = (itemId: string, sourceIndex: number, targetIndex: number): AppThunk => async (dispatch, getState) => {

};

export default userQueueSlice.reducer;
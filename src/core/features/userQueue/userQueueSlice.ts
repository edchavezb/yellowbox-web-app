import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserQueueApi, removeAlbumFromQueueApi, removeArtistFromQueueApi, removePlaylistFromQueueApi, removeTrackFromQueueApi, reorderQueueItemApi } from "core/api/userqueue";
import { AppThunk } from "core/store/store";
import { QueueItem } from "core/types/interfaces";
import { initErrorToast, initRemoveFromBoxToast } from "../toast/toastSlice";

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

export const reorderQueueThunk = (itemId: string, sourceIndex: number, targetIndex: number): AppThunk => async (dispatch, getState) => {

};

export default userQueueSlice.reducer;
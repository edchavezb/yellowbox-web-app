import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { BoxItemType } from "core/types/types"

interface AddToBoxToastPayload {
  itemType: BoxItemType
  boxName?: string
  isQueue?: boolean
}

interface AddToFolderToastPayload {
  folderName: string
  boxName: string
}

interface ErrorToastPayload {
  error: string
}

interface IToast {
  options: {
    title: string
    description: string
    status?: "success" | "error" | "warning" | "info" | "loading"
  }
  isOpen: boolean
}

const initialState: IToast = {
  options: {
    title: "",
    description: "",
    status: undefined,
  },
  isOpen: false
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    initBoxOrFolderCreatedToast(state, action: PayloadAction<{itemName: string}>) {
      const {itemName} = action.payload;
      state.options = {
        title: "Done!",
        description: `${itemName} was added to your library`,
        status: "info"
      };
      state.isOpen = true;
    },
    initBoxOrFolderDeletedToast(state, action: PayloadAction<{itemType: string}>) {
      const {itemType} = action.payload;
      state.options = {
        title: "Done!",
        description: `1 ${itemType} was removed from your library`,
        status: "info"
      };
      state.isOpen = true;
    },
    initAddToFolderToast(state, action: PayloadAction<AddToFolderToastPayload>) {
      const {boxName, folderName} = action.payload;
      state.options = {
        title: "Done!",
        description: `${boxName} was added to ${folderName}`,
        status: "info"
      };
      state.isOpen = true;
    },
    initRemoveFromFolderToast(state, action: PayloadAction<AddToFolderToastPayload>) {
      const {boxName, folderName} = action.payload;
      state.options = {
        title: "Done!",
        description: `${boxName} was removed from ${folderName}`,
        status: "info"
      };
      state.isOpen = true;
    },
    initAddToBoxToast(state, action: PayloadAction<AddToBoxToastPayload>) {
      const {boxName, itemType, isQueue} = action.payload;
      state.options = {
        title: "Done!",
        description: `1 ${itemType} was added to ${isQueue ? "your queue" : boxName}`,
        status: "info"
      };
      state.isOpen = true;
    },
    initRemoveFromBoxToast(state, action: PayloadAction<AddToBoxToastPayload>) {
      const {boxName, itemType, isQueue} = action.payload;
      state.options = {
        title: "Done!",
        description: `1 ${itemType} was removed from ${isQueue ? "your queue" : boxName}`,
        status: "info"
      };
      state.isOpen = true;
    },
    initAlreadyInBoxToast(state, action: PayloadAction<AddToBoxToastPayload>) {
      const {boxName, itemType, isQueue} = action.payload;
      state.options = {
        title: "Item already in Box",
        description: `This ${itemType} already exists in ${isQueue ? "your queue" : boxName}`,
        status: "info"
      };
      state.isOpen = true;
    },
    initMarkedAsPlayedToast(state, action: PayloadAction<{itemType: string, newPlayedStatus: boolean}>) {
      const {itemType, newPlayedStatus} = action.payload;
      state.options = {
        title: "Done!",
        description: `1 ${itemType} was marked as ${newPlayedStatus ? "played" : "unplayed"} in your library`,
        status: "info"
      };
      state.isOpen = true;
    },
    initAddToFavoritesToast(state, action: PayloadAction<{boxName: string}>) {
      const {boxName} = action.payload;
      state.options = {
        title: "Done!",
        description: `${boxName} was added to your favorites`,
        status: "info"
      };
      state.isOpen = true;
    },
    initRemoveFromFavoritesToast(state, action: PayloadAction<{boxName: string}>) {
      const {boxName} = action.payload;  
      state.options = {
        title: "Done!",
        description: `${boxName} was removed from your favorites`,
        status: "info"
      };
      state.isOpen = true;
    },
    initErrorToast(state, action: PayloadAction<ErrorToastPayload>) {
      const {error} = action.payload;
      state.options = {
        title: "Oops, an error occurred",
        description: error,
        status: "error"
      };
      state.isOpen = true;
    },
    setIsToastOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload
    },
  }
})

export const {
  initBoxOrFolderCreatedToast,
  initBoxOrFolderDeletedToast,
  initAddToFolderToast,
  initRemoveFromFolderToast,
  initAddToBoxToast,
  initRemoveFromBoxToast,
  initAlreadyInBoxToast,
  initMarkedAsPlayedToast,
  initAddToFavoritesToast,
  initRemoveFromFavoritesToast,
  initErrorToast,
  setIsToastOpen
} = toastSlice.actions;

export default toastSlice.reducer;
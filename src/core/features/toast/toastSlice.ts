import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { BoxItemType } from "core/types/types"

interface AddToBoxToastPayload {
  itemType: BoxItemType
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
    initAddToBoxToast(state, action: PayloadAction<AddToBoxToastPayload>) {
      const {boxName, itemType} = action.payload;
      state.options = {
        title: "Done!",
        description: `1 ${itemType} was added to ${boxName}`,
        status: "info"
      };
      state.isOpen = true;
    },
    initAlreadyInBoxToast(state, action: PayloadAction<AddToBoxToastPayload>) {
      const {boxName, itemType} = action.payload;
      state.options = {
        title: "Item already in Box",
        description: `This ${itemType} already exists in ${boxName}`,
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
  initAddToBoxToast,
  initAlreadyInBoxToast,
  initErrorToast,
  setIsToastOpen
} = toastSlice.actions;

export default toastSlice.reducer;
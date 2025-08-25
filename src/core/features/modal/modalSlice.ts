import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Album, Artist, Playlist, Track } from "core/types/interfaces"

export type ModalType =
  "Log In"
  | "Sign Up"
  | "New Box"
  | "Edit Box"
  | "Clone Box"
  | "Delete Box"
  | "Edit Folder"
  | "Delete Folder"
  | "Sorting Options"
  | "Delete Item"
  | "Add To Folder"
  | "Add To Box"
  | "Add To Subsection"
  | "Change Order"
  | "Item Note"
  | "Box Subsections"
  | "New Folder"
  | "Update User Image"
  | "User Friends List"
  | "";

interface IModal {
  modalState: {
    visible: boolean
    type: ModalType
    itemData?: Artist | Album | Track | Playlist | undefined
    viewingFriendsList?: "followers" | "followedUsers" | undefined
    boxId?: string
    folderId?: string
    subId?: string
    page?: string
    customTitle?: string
  }
}

const initialState: IModal = {
  modalState: { itemData: undefined, visible: false, type: "New Box", boxId: "", page: "" }
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModalState(state, action: PayloadAction<IModal["modalState"]>) {
      state.modalState = action.payload
    }
  }
})

export const {
  setModalState
} = modalSlice.actions;

export default modalSlice.reducer;
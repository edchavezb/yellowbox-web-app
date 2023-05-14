import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Album, Artist, Playlist, Track } from "core/types/interfaces"

export type ModalType = 
    "New Box" 
    | "Edit Box"
    | "Sorting Options" 
    | "Delete Box"
    | "Delete Item" 
    | "Add To Folder"
    | "Add To Box" 
    | "Add To Subsection" 
    | "Change Order" 
    | "Item Note" 
    | "Box Subsections"
    | "New Folder"
    | "";

interface IModal {
    modalState: {
        itemData?: Artist | Album | Track | Playlist | undefined
        visible: boolean
        type: ModalType
        boxId: string
        subId?: string
        page: string
    }
}

const initialState: IModal = {
    modalState: {itemData: undefined, visible: false, type: "New Box", boxId: "", page: ""}
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
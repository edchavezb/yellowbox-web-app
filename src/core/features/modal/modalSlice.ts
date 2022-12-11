import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Album, Artist, Playlist, Track } from "core/types/interfaces"

interface IModal {
    modalState: {
        itemData?: Artist | Album | Track | Playlist | undefined
        visible: boolean
        type: string
        boxId: string
        page: string
    }
}

const initialState: IModal = {
    modalState: {itemData: undefined, visible: false, type: "", boxId: "", page: ""}
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
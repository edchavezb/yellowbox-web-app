import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getUserBoxesApi } from "core/api/users"
import { AppThunk } from "core/store/store"
import { UserBox } from "core/types/interfaces"

interface UserBoxesState {
    boxes: UserBox[]
}

const initialState: UserBoxesState = {
    boxes: []
};

const userBoxesSlice = createSlice({
    name: 'userBoxes',
    initialState,
    reducers: {
        setUserBoxes(state, action: PayloadAction<UserBox[]>) {
            state.boxes = action.payload
        },
        updateUserBox(state, action: PayloadAction<{targetId: string, updatedBox: UserBox}>) {
            const targetIndex = state.boxes.findIndex(box => box._id === action.payload.targetId);
            state.boxes[targetIndex] = action.payload.updatedBox;
        },
        createUserBox(state, action: PayloadAction<UserBox>) {
            state.boxes.push(action.payload);
        },
        deleteUserBox(state, action: PayloadAction<{targetId: string}>) {
            state.boxes.splice(state.boxes.findIndex(box => box._id === action.payload.targetId), 1);
        }
    }
})

export const { 
    setUserBoxes, 
    updateUserBox, 
    createUserBox, 
    deleteUserBox
} = userBoxesSlice.actions;

//Thunks for this slice
export const fetchUserBoxes = (userId: string): AppThunk => async (dispatch) => {
    try {
        const userBoxes = await getUserBoxesApi(userId);
        dispatch(setUserBoxes(userBoxes!))
    } catch (err) {
        dispatch(setUserBoxes([]))
    }
}

export default userBoxesSlice.reducer;
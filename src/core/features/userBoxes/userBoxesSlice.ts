import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createUserBoxApi, deleteUserBoxApi } from "core/api/userboxes"
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

export const createUserBoxThunk = (boxObj: Omit<UserBox, '_id'>): AppThunk => async (dispatch) => {
    try {
        const newBox = await createUserBoxApi(boxObj)
        dispatch(createUserBox(newBox!))
    } catch (err) {
        console.log(err)
    }
}

export const deleteUserBoxThunk = (boxId: string): AppThunk => async (dispatch) => {
    console.log('Delete Userbox thunk')
    try {
        await deleteUserBoxApi(boxId)
        dispatch(deleteUserBox({targetId: boxId}))
    } catch (err) {
        console.log(err)
    }
}

export default userBoxesSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createUserBoxApi, deleteUserBoxApi, getDashboardBoxesApi } from "core/api/userboxes"
import { getUserBoxesApi, updateUserDashboardBoxesApi } from "core/api/users"
import { AppThunk } from "core/store/store"
import { DashboardBox, UserBox, UserFolder } from "core/types/interfaces"
import { updateUserFolder } from "../userFolders/userFoldersSlice"

interface UserBoxesState {
    userBoxes: DashboardBox[]
    dashboardBoxes: DashboardBox[]
}

const initialState: UserBoxesState = {
    userBoxes: [],
    dashboardBoxes: []
};

const userBoxesSlice = createSlice({
    name: 'userBoxes',
    initialState,
    reducers: {
        setUserBoxes(state, action: PayloadAction<DashboardBox[]>) {
            state.userBoxes = action.payload
        },
        setDashboardBoxes(state, action: PayloadAction<DashboardBox[]>) {
            state.dashboardBoxes = action.payload
        },
        updateBoxName(state, action: PayloadAction<{targetId: string, newName: string}>) {
            const targetIndex = state.userBoxes.findIndex(box => box.boxId === action.payload.targetId);
            state.userBoxes[targetIndex].boxName = action.payload.newName;
            const targetIndexDashboard = state.dashboardBoxes.findIndex(box => box.boxId === action.payload.targetId);
            state.dashboardBoxes[targetIndexDashboard].boxName = action.payload.newName;
        },
        createBox(state, action: PayloadAction<DashboardBox>) {
            state.userBoxes.push(action.payload);
            state.dashboardBoxes.push(action.payload);
        },
        deleteBox(state, action: PayloadAction<{targetId: string}>) {
            const targetIndex = state.userBoxes.findIndex(box => box.boxId === action.payload.targetId);
            console.log(targetIndex)
            if (targetIndex != undefined) {
                state.userBoxes.splice(targetIndex, 1);
            }
        },
        removeBoxFromDashboard(state, action: PayloadAction<{targetId: string}>) {
            const targetIndex = state.dashboardBoxes.findIndex(box => box.boxId === action.payload.targetId);
            console.log(targetIndex)
            if (targetIndex != undefined) {
                state.dashboardBoxes.splice(targetIndex, 1);
            }
        }
    }
})

export const { 
    setUserBoxes, 
    setDashboardBoxes,
    updateBoxName, 
    createBox, 
    deleteBox,
    removeBoxFromDashboard
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

export const fetchDashboardBoxes = (boxIds: string[]): AppThunk => async (dispatch) => {
    const uniqueIds = new Set(boxIds)
    try {
        const dashboardBoxes = await getDashboardBoxesApi(boxIds);
        dispatch(setDashboardBoxes(dashboardBoxes!))
    } catch (err) {
        dispatch(setDashboardBoxes([]))
    }
}

export const reorderDashboardBoxesThunk = (sourceIndex: number, targetIndex: number): AppThunk => async (dispatch, getState) => {
  try {
    const userId = getState().userData.authenticatedUser._id;
    const boxesCopy = JSON.parse(JSON.stringify(getState().userBoxesData.dashboardBoxes)) as DashboardBox[];
    const reorderItem = boxesCopy.splice(sourceIndex, 1)[0];
    boxesCopy.splice(targetIndex, 0, reorderItem);
    const updatedBoxIds = boxesCopy.map(box => box.boxId);
    const updatedBoxes = await updateUserDashboardBoxesApi(userId, updatedBoxIds)
    if (updatedBoxes) {
      dispatch(fetchDashboardBoxes(updatedBoxes))
    }
  } catch (err) {
    console.log(err)
  }
}

export const createUserBoxThunk = (boxObj: Omit<UserBox, '_id'>): AppThunk => async (dispatch) => {
    try {
        const newBox = await createUserBoxApi(boxObj)
        dispatch(createBox(newBox!))
    } catch (err) {
        console.log(err)
    }
}

export const deleteUserBoxThunk = (boxId: string, containingFolder: boolean, folderId?: string): AppThunk => async (dispatch) => {
    try {
        const updatedEntity = await deleteUserBoxApi(boxId, containingFolder, folderId);
        dispatch(deleteBox({targetId: boxId}))
        if (containingFolder) {
            dispatch(updateUserFolder({targetId: folderId!, updatedFolder: updatedEntity as UserFolder}))
        }
        else {
            dispatch(removeBoxFromDashboard({targetId: boxId}))
        }
    } catch (err) {
        console.log(err)
    }
}

export default userBoxesSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { cloneBoxApi, createUserBoxApi, deleteUserBoxApi, getDashboardBoxesApi } from "core/api/userboxes"
import { getUserBoxesApi, reorderDashboardBoxApi, updateUserDashboardBoxesApi } from "core/api/users"
import { AppThunk } from "core/store/store"
import { BoxCreateDTO, DashboardBox, UserBox, UserFolder } from "core/types/interfaces"
import { updateUserFolder } from "../userFolders/userFoldersSlice"
import { initBoxOrFolderCreatedToast, initBoxOrFolderDeletedToast, initErrorToast } from "../toast/toastSlice"

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
            state.userBoxes[targetIndex].name = action.payload.newName;
            const targetIndexDashboard = state.dashboardBoxes.findIndex(box => box.boxId === action.payload.targetId);
            state.dashboardBoxes[targetIndexDashboard].name = action.payload.newName;
        },
        createBox(state, action: PayloadAction<DashboardBox>) {
            state.userBoxes.push(action.payload);
            state.dashboardBoxes.push(action.payload);
        },
        deleteBox(state, action: PayloadAction<{targetId: string}>) {
            const targetIndex = state.userBoxes.findIndex(box => box.boxId === action.payload.targetId);
            if (targetIndex !== undefined) {
                state.userBoxes.splice(targetIndex, 1);
            }
        },
        addBoxToDashboard(state, action: PayloadAction<{boxId: string, boxName: string, position: number}>) {
            const {boxId, boxName, position} = action.payload;
            state.dashboardBoxes.push({boxId, name: boxName, position, folderPosition: null})
        },
        removeBoxFromDashboard(state, action: PayloadAction<{targetId: string}>) {
            const targetIndex = state.dashboardBoxes.findIndex(box => box.boxId === action.payload.targetId);
            if (targetIndex !== undefined) {
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
    addBoxToDashboard,
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
    try {
        const dashboardBoxes = await getDashboardBoxesApi(boxIds);
        dispatch(setDashboardBoxes(dashboardBoxes!))
    } catch (err) {
        dispatch(setDashboardBoxes([]))
    }
}

export const reorderDashboardBoxesThunk = (sourceIndex: number, targetIndex: number): AppThunk => async (dispatch, getState) => {
  try {
    const userId = getState().userData.authenticatedUser.userId;
    const boxesCopy = JSON.parse(JSON.stringify(getState().userBoxesData.dashboardBoxes)) as DashboardBox[];
    const reorderItem = boxesCopy.splice(sourceIndex, 1)[0];
    const targetItem = boxesCopy[targetIndex];
    boxesCopy.splice(targetIndex, 0, reorderItem);
    dispatch(setDashboardBoxes(boxesCopy));
    await reorderDashboardBoxApi(userId, reorderItem.boxId, targetItem.position!)
  } catch (err) {
    console.log(err)
  }
}

export const createUserBoxThunk = (boxObj: BoxCreateDTO): AppThunk => async (dispatch) => {
    try {
        const newBox = await createUserBoxApi(boxObj);
        dispatch(createBox(newBox!));
        dispatch(initBoxOrFolderCreatedToast({itemName: boxObj.name}));
    } catch (err) {
        console.log(err)
        dispatch(initErrorToast({error: "Failed to create a new box in your library"}));
    }
}

export const cloneUserBoxThunk = (boxId: string, name: string, description: string, isPublic: boolean, creator: string): AppThunk => async (dispatch) => {
    try {
        const newBox = await cloneBoxApi(boxId, name, description, isPublic, creator)
        dispatch(createBox(newBox!))
        dispatch(initBoxOrFolderCreatedToast({itemName: newBox!.name}));
    } catch (err) {
        console.log(err)
        dispatch(initErrorToast({error: "Failed to clone this box into your library"}));
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
        dispatch(initBoxOrFolderDeletedToast({itemType: "box"}));
    } catch (err) {
        console.log(err)
        dispatch(initErrorToast({error: "Failed to delete this box from your library"}));
    }
}

export default userBoxesSlice.reducer;
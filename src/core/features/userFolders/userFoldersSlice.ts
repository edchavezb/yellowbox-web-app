import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addBoxToFolderApi, createUserFolderApi, deleteUserFolderApi, getFoldersByIdsApi, removeBoxFromFolderApi } from "core/api/userfolders"
import { AppThunk } from "core/store/store"
import { UserFolder } from "core/types/interfaces"
import { fetchDashboardBoxes } from "../userBoxes/userBoxesSlice"

interface UserFoldersState {
    folders: UserFolder[]
}

const initialState: UserFoldersState = {
    folders: []
};

const userFoldersSlice = createSlice({
    name: 'userFolders',
    initialState,
    reducers: {
        setUserFolders(state, action: PayloadAction<UserFolder[]>) {
            state.folders = action.payload
        },
        updateUserFolder(state, action: PayloadAction<{targetId: string, updatedFolder: UserFolder}>) {
            const targetIndex = state.folders.findIndex(folder => folder._id === action.payload.targetId);
            state.folders[targetIndex] = action.payload.updatedFolder;
        },
        createUserFolder(state, action: PayloadAction<UserFolder>) {
            state.folders.push(action.payload);
        },
        deleteUserFolder(state, action: PayloadAction<{targetId: string}>) {
            state.folders.splice(state.folders.findIndex(folder => folder._id === action.payload.targetId), 1);
        }
    }
})

export const { 
    setUserFolders, 
    updateUserFolder, 
    createUserFolder, 
    deleteUserFolder
} = userFoldersSlice.actions;

//Thunks for this slice
export const fetchDashboardFolders = (folderIds: string[]): AppThunk => async (dispatch) => {
    try {
        const userFolders = await getFoldersByIdsApi(folderIds);
        dispatch(setUserFolders(userFolders!))
    } catch (err) {
        dispatch(setUserFolders([]))
    }
}

export const createUserFolderThunk = (folderObj: Omit<UserFolder, '_id'>): AppThunk => async (dispatch) => {
    try {
        const response = await createUserFolderApi(folderObj)
        dispatch(createUserFolder(response?.newFolder!))
    } catch (err) {
        console.log(err)
    }
}

export const deleteUserFolderThunk = (folderId: string): AppThunk => async (dispatch) => {
    try {
        await deleteUserFolderApi(folderId)
        dispatch(deleteUserFolder({targetId: folderId}))
    } catch (err) {
        console.log(err)
    }
}

export const addBoxToFolderThunk = (folderId: string, boxId: string, boxName: string): AppThunk => async (dispatch) => {
    try {
        const response = await addBoxToFolderApi(folderId, boxId, boxName)
        dispatch(updateUserFolder({targetId: folderId, updatedFolder: response?.updatedFolder!}))
        dispatch(fetchDashboardBoxes(response?.updatedDashboardBoxes!))
    } catch (err) {
        console.log(err)
    }
}

export const removeBoxFromFolderThunk = (folderId: string, boxId: string): AppThunk => async (dispatch) => {
    try {
        const response = await removeBoxFromFolderApi(folderId, boxId)
        dispatch(updateUserFolder({targetId: folderId, updatedFolder: response?.updatedFolder!}))
        dispatch(fetchDashboardBoxes(response?.updatedDashboardBoxes!))
    } catch (err) {
        console.log(err)
    }
}

export default userFoldersSlice.reducer;
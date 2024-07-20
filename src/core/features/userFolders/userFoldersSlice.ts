import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addBoxToFolderApi, createUserFolderApi, deleteUserFolderApi, getFoldersByIdsApi, moveBoxBetweenFoldersApi, removeBoxFromFolderApi, updateFolderBoxesApi } from "core/api/userfolders"
import { AppThunk } from "core/store/store"
import { DashboardBox, UserFolder } from "core/types/interfaces"
import { addBoxToDashboard, fetchDashboardBoxes, removeBoxFromDashboard } from "../userBoxes/userBoxesSlice"
import { fetchFolderDetailThunk } from "../currentFolderDetail/currentFolderDetailSlice"
import { initAddToFolderToast, initErrorToast, initRemoveFromFolderToast } from "../toast/toastSlice"

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
        },
        addBoxToFolder(state, action: PayloadAction<{targetId: string, box: DashboardBox}>) {
            const {targetId, box} = action.payload;
            const targetIndex = state.folders.findIndex(folder => folder._id === targetId);
            state.folders[targetIndex].boxes.push(box);
        },
        removeBoxFromFolder(state, action: PayloadAction<{targetId: string, boxId: string}>) {
            const {targetId, boxId} = action.payload;
            const targetIndex = state.folders.findIndex(folder => folder._id === targetId);
            const boxIndex = state.folders[targetIndex].boxes.findIndex(box => box.boxId === boxId)
            state.folders[targetIndex].boxes.splice(boxIndex, 1);
        },
        updateSidebarFolderBoxes(state, action: PayloadAction<{targetId: string, updatedBoxes: DashboardBox[]}>) {
            const targetIndex = state.folders.findIndex(folder => folder._id === action.payload.targetId);
            state.folders[targetIndex].boxes = action.payload.updatedBoxes;
        }
    }
})

export const { 
    setUserFolders, 
    updateUserFolder, 
    createUserFolder, 
    deleteUserFolder,
    addBoxToFolder,
    removeBoxFromFolder,
    updateSidebarFolderBoxes
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
        const response = await deleteUserFolderApi(folderId);
        if (response?.updatedDashboardFolders) {
            const {updatedDashboardFolders, updatedDashboardBoxes} = response;
            dispatch(fetchDashboardFolders(updatedDashboardFolders));
            dispatch(fetchDashboardBoxes(updatedDashboardBoxes));
        }
    } catch (err) {
        console.log(err)
    }
}

export const addBoxToFolderThunk = (folderId: string, boxId: string, boxName: string): AppThunk => async (dispatch, getState) => {
    try {
        const { folder: currentFolder, isUserViewing} = getState().currentFolderDetailData;
        dispatch(addBoxToFolder({targetId: folderId, box: {boxId, boxName}}))
        dispatch(removeBoxFromDashboard({targetId: boxId}))
        const response = await addBoxToFolderApi(folderId, boxId, boxName)
        if (currentFolder._id === folderId && isUserViewing) {
            // Refresh folder if user viewing it
            dispatch(fetchFolderDetailThunk(currentFolder._id));
        }
        dispatch(initAddToFolderToast({boxName, folderName: response.updatedFolder.name}));
    } catch (err) {
        console.log(err)
        dispatch(initErrorToast({error: `Failed to add ${boxName} to folder`}));
    }
}

export const removeBoxFromFolderThunk = (folderId: string, boxId: string, boxName: string): AppThunk => async (dispatch, getState) => {
    try {
        const { folder: currentFolder, isUserViewing} = getState().currentFolderDetailData;
        dispatch(removeBoxFromFolder({targetId: folderId, boxId}))
        dispatch(addBoxToDashboard({boxId, boxName}))
        const response = await removeBoxFromFolderApi(folderId, boxId)
        if (currentFolder._id === folderId && isUserViewing) {
            // Refresh folder if user viewing it
            dispatch(fetchFolderDetailThunk(currentFolder._id));
        }
        dispatch(initRemoveFromFolderToast({boxName, folderName: response.updatedFolder.name}));
    } catch (err) {
        console.log(err)
        dispatch(initErrorToast({error: `Failed to remove ${boxName} from folder`}));
    }
}

export const moveBoxBetweenFoldersThunk = (sourceId: string, targetId: string, boxId: string, boxName: string): AppThunk => async (dispatch, getState) => {
    try {
        const { folder: currentFolder, isUserViewing} = getState().currentFolderDetailData;
        dispatch(addBoxToFolder({targetId, box: {boxId, boxName}}))
        dispatch(removeBoxFromFolder({targetId: sourceId, boxId}))
        const response = await moveBoxBetweenFoldersApi(sourceId, targetId, boxId, boxName)
        if ((currentFolder._id === sourceId || currentFolder._id === targetId) && isUserViewing) {
            dispatch(fetchFolderDetailThunk(currentFolder._id));
        }
        dispatch(initAddToFolderToast({boxName, folderName: response.updatedTargetFolder.name}));
    } catch (err) {
        console.log(err)
        dispatch(initErrorToast({error: `Failed to add ${boxName} to folder`}));
    }
}

export const reorderSidebarFolderBoxesThunk = (folderId: string, sourceIndex: number, targetIndex: number): AppThunk => async (dispatch, getState) => {
    try {
        const { folder: currentFolder, isUserViewing} = getState().currentFolderDetailData;
        const folderBoxesCopy = JSON.parse(JSON.stringify(getState().userFoldersData.folders.find(folder => folder._id === folderId)?.boxes)) as DashboardBox[];
        const reorderItem = folderBoxesCopy.splice(sourceIndex, 1)[0];
        folderBoxesCopy.splice(targetIndex, 0, reorderItem);
        dispatch(updateSidebarFolderBoxes({targetId: folderId, updatedBoxes: folderBoxesCopy}));
        await updateFolderBoxesApi(folderId, folderBoxesCopy)
        if (currentFolder._id === folderId && isUserViewing) {
            // Refresh folder if user viewing it
            dispatch(fetchFolderDetailThunk(currentFolder._id));
        }
    } catch (err) {
        console.log(err)
    }
}

export default userFoldersSlice.reducer;
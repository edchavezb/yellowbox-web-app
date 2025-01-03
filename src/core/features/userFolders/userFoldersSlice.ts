import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addBoxToFolderApi, createUserFolderApi, deleteUserFolderApi, getFoldersByIdsApi, moveBoxBetweenFoldersApi, removeBoxFromFolderApi, reorderFolderBoxesApi } from "core/api/userfolders"
import { AppThunk } from "core/store/store"
import { DashboardBox, UserFolder } from "core/types/interfaces"
import { addBoxToDashboard, removeBoxFromDashboard, setDashboardBoxes } from "../userBoxes/userBoxesSlice"
import { fetchFolderDetailThunk } from "../currentFolderDetail/currentFolderDetailSlice"
import { initAddToFolderToast, initBoxOrFolderCreatedToast, initBoxOrFolderDeletedToast, initErrorToast, initRemoveFromFolderToast } from "../toast/toastSlice"
import { reorderItems } from "core/helpers/reorderItems"

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
            state.folders = action.payload;
        },
        updateUserFolder(state, action: PayloadAction<{targetId: string, updatedFolder: UserFolder}>) {
            const targetIndex = state.folders.findIndex(folder => folder.folderId === action.payload.targetId);
            state.folders[targetIndex] = action.payload.updatedFolder;
        },
        updateUserFolderBox(state, action: PayloadAction<{folderId: string, boxId: string, updatedBox: DashboardBox}>) {
            const folderIndex = state.folders.findIndex(folder => folder.folderId === action.payload.folderId);
            const boxIndex = state.folders[folderIndex].boxes.findIndex(box => box.boxId === action.payload.boxId);
            state.folders[folderIndex].boxes[boxIndex] = action.payload.updatedBox;
        },
        createUserFolder(state, action: PayloadAction<UserFolder>) {
            state.folders.push(action.payload);
        },
        deleteUserFolder(state, action: PayloadAction<{targetId: string}>) {
            state.folders.splice(state.folders.findIndex(folder => folder.folderId === action.payload.targetId), 1);
        },
        addBoxToFolder(state, action: PayloadAction<{targetId: string, box: DashboardBox}>) {
            const {targetId, box} = action.payload;
            const targetIndex = state.folders.findIndex(folder => folder.folderId === targetId);
            state.folders[targetIndex].boxes.push(box);
        },
        removeBoxFromFolder(state, action: PayloadAction<{targetId: string, boxId: string}>) {
            const {targetId, boxId} = action.payload;
            const targetIndex = state.folders.findIndex(folder => folder.folderId === targetId);
            const boxIndex = state.folders[targetIndex].boxes.findIndex(box => box.boxId === boxId)
            state.folders[targetIndex].boxes.splice(boxIndex, 1);
        },
        updateSidebarFolderBoxes(state, action: PayloadAction<{targetId: string, updatedBoxes: DashboardBox[]}>) {
            const targetIndex = state.folders.findIndex(folder => folder.folderId === action.payload.targetId);
            state.folders[targetIndex].boxes = action.payload.updatedBoxes;
        }
    }
})

export const { 
    setUserFolders, 
    updateUserFolder, 
    updateUserFolderBox,
    createUserFolder, 
    deleteUserFolder,
    addBoxToFolder,
    removeBoxFromFolder,
    updateSidebarFolderBoxes,
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

export const createUserFolderThunk = (folderObj: Omit<UserFolder, 'folderId'  | 'boxes'>): AppThunk => async (dispatch) => {
    try {
        const response = await createUserFolderApi(folderObj)
        dispatch(createUserFolder(response?.newFolder!))
        dispatch(initBoxOrFolderCreatedToast({itemName: response.newFolder.name}))
    } catch (err) {
        console.log(err)
        dispatch(initErrorToast({error: `Failed to create new folder`}));
    }
}

export const deleteUserFolderThunk = (folderId: string): AppThunk => async (dispatch) => {
    try {
        const response = await deleteUserFolderApi(folderId);
        if (response?.updatedDashboardFolders) {
            const {updatedDashboardFolders, updatedDashboardBoxes} = response;
            dispatch(setUserFolders(updatedDashboardFolders));
            dispatch(setDashboardBoxes(updatedDashboardBoxes));
        }
        dispatch(initBoxOrFolderDeletedToast({itemType: 'folder'}))
    } catch (err) {
        console.log(err)
        dispatch(initErrorToast({error: `Failed to delete folder`}));
    }
}

export const addBoxToFolderThunk = (folderId: string, boxId: string, boxName: string, folderPosition: number): AppThunk => async (dispatch, getState) => {
    try {
        const { folder: currentFolder, isUserViewing} = getState().currentFolderDetailData;
        dispatch(addBoxToFolder({targetId: folderId, box: {boxId, name: boxName, position: null, folderPosition}}))
        dispatch(removeBoxFromDashboard({targetId: boxId}))
        const response = await addBoxToFolderApi(folderId, boxId, folderPosition)
        if (currentFolder.folderId === folderId && isUserViewing) {
            // Refresh folder if user viewing it
            dispatch(fetchFolderDetailThunk(currentFolder.folderId));
        }
        dispatch(initAddToFolderToast({boxName, folderName: response.updatedFolder.name}));
    } catch (err) {
        console.log(err)
        dispatch(initErrorToast({error: `Failed to add ${boxName} to folder`}));
    }
}

export const removeBoxFromFolderThunk = (folderId: string, boxId: string, boxName: string, newPosition: number): AppThunk => async (dispatch, getState) => {
    try {
        const { folder: currentFolder, isUserViewing} = getState().currentFolderDetailData;
        dispatch(removeBoxFromFolder({targetId: folderId, boxId}))
        dispatch(addBoxToDashboard({boxId, boxName, position: newPosition}))
        const response = await removeBoxFromFolderApi(folderId, boxId)
        if (currentFolder.folderId === folderId && isUserViewing) {
            // Refresh folder if user viewing it
            dispatch(fetchFolderDetailThunk(currentFolder.folderId));
        }
        dispatch(initRemoveFromFolderToast({boxName, folderName: response.updatedFolder.name}));
    } catch (err) {
        console.log(err)
        dispatch(initErrorToast({error: `Failed to remove ${boxName} from folder`}));
    }
}

export const moveBoxBetweenFoldersThunk = (sourceFolderId: string, targetFolderId: string, boxId: string, boxName: string, newFolderPosition: number): AppThunk => async (dispatch, getState) => {
    try {
        const { folder: currentFolder, isUserViewing} = getState().currentFolderDetailData;
        dispatch(addBoxToFolder({targetId: targetFolderId, box: {boxId, name: boxName, position: null, folderPosition: newFolderPosition}}));
        dispatch(removeBoxFromFolder({targetId: sourceFolderId, boxId}));
        const response = await moveBoxBetweenFoldersApi(sourceFolderId, targetFolderId, boxId, newFolderPosition)
        if ((currentFolder.folderId === sourceFolderId || currentFolder.folderId === targetFolderId) && isUserViewing) {
            dispatch(fetchFolderDetailThunk(currentFolder.folderId));
        }
        dispatch(initAddToFolderToast({boxName, folderName: response.updatedTargetFolder.name}));
    } catch (err) {
        console.log(err)
        dispatch(initErrorToast({error: `Failed to add ${boxName} to folder`}));
    }
}

export const reorderFolderBoxesThunk = (folderId: string, boxId: string, sourceIndex: number, destinationIndex: number): AppThunk => async (dispatch, getState) => {
    try {
        const { folder: currentFolder, isUserViewing} = getState().currentFolderDetailData;
        const folderBoxesCopy = JSON.parse(JSON.stringify(getState().userFoldersData.folders.find(folder => folder.folderId === folderId)?.boxes)) as DashboardBox[];
        const destinationId = folderBoxesCopy[destinationIndex].boxId;
        const updatedFolderBoxes = reorderItems(folderBoxesCopy, sourceIndex, destinationIndex)
        dispatch(updateSidebarFolderBoxes({targetId: folderId, updatedBoxes: updatedFolderBoxes}));
        await reorderFolderBoxesApi(folderId, boxId, destinationId);
        if (currentFolder.folderId === folderId && isUserViewing) {
            // Refresh folder if user viewing it
            dispatch(fetchFolderDetailThunk(currentFolder.folderId));
        }
    } catch (err) {
        console.log(err)
    }
}

export default userFoldersSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getFolderByIdApi, updateFolderBoxesApi, updateUserFolderApi } from "core/api/userfolders";
import { AppThunk } from "core/store/store";
import { DashboardBox, UserFolder } from "core/types/interfaces";
import { updateSidebarFolderBoxes, updateUserFolder } from "../userFolders/userFoldersSlice";

interface CurrentFolderDetailState {
  folder: UserFolder & { creatorName?: string }
  isUserViewing: boolean
}

const initialState: CurrentFolderDetailState = {
  folder: {} as UserFolder,
  isUserViewing: false,
};

const currentFolderDetailSlice = createSlice({
  name: 'currentFolderDetail',
  initialState,
  reducers: {
    setCurrentFolderDetail(state, action: PayloadAction<UserFolder & { creatorName?: string }>) {
      state.folder = action.payload;
    },
    updateCurrentFolderDetail(state, action: PayloadAction<UserFolder>) {
      const { name, description } = action.payload;
      state.folder.name = name;
      state.folder.description = description;
      state.folder.isPublic = action.payload.isPublic;
    },
    updateFolderBoxes(state, action: PayloadAction<{ updatedBoxes: DashboardBox[] }>) {
      state.folder.boxes = action.payload.updatedBoxes;
    },
    setIsUserViewing(state, action: PayloadAction<boolean>) {
      state.isUserViewing = action.payload;
    },
  },
});

export const {
  setIsUserViewing,
  setCurrentFolderDetail,
  updateCurrentFolderDetail,
  updateFolderBoxes
} = currentFolderDetailSlice.actions;

// Thunks for this slice
export const fetchFolderDetailThunk = (folderId: string): AppThunk => async (dispatch) => {
  try {
    const currentFolderDetail = await getFolderByIdApi(folderId);
    if (currentFolderDetail) {
      const { folderData, creatorName } = currentFolderDetail;
      dispatch(setCurrentFolderDetail({ ...folderData, creatorName }))
      dispatch(setIsUserViewing(true))
    }
  } catch (err) {
    dispatch(setCurrentFolderDetail({} as UserFolder));
  }
};

export const updateCurrentFolderDetailThunk = (folderId: string, updatedFolder: UserFolder): AppThunk => async (dispatch) => {
  try {
    const folderDetail = await updateUserFolderApi(folderId, updatedFolder);
    dispatch(updateCurrentFolderDetail(folderDetail!.updatedFolder))
    dispatch(updateUserFolder({ targetId: folderId, updatedFolder: folderDetail!.updatedFolder }))
  } catch (err) {
    console.log(err)
  }
}

export const reorderFolderBoxesThunk = (folderId: string, sourceIndex: number, targetIndex: number): AppThunk => async (dispatch, getState) => {
  try {
    const folderBoxesCopy = JSON.parse(JSON.stringify(getState().currentFolderDetailData.folder.boxes)) as DashboardBox[];
    const reorderItem = folderBoxesCopy.splice(sourceIndex, 1)[0];
    folderBoxesCopy.splice(targetIndex, 0, reorderItem);
    dispatch(updateFolderBoxes({ updatedBoxes: folderBoxesCopy }));
    const response = await updateFolderBoxesApi(folderId, folderBoxesCopy)
    if (response?.updatedFolder) {
      dispatch(updateSidebarFolderBoxes({ targetId: folderId, updatedBoxes: response.updatedFolder.boxes }))
    }
  } catch (err) {
    console.log(err)
  }
}

export default currentFolderDetailSlice.reducer;

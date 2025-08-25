import userReducer from "core/features/user/userSlice";
import userBoxesReducer from "core/features/userBoxes/userBoxesSlice";
import userFoldersReducer from "core/features/userFolders/userFoldersSlice";
import userQueueReducer from "core/features/userQueue/userQueueSlice";
import currentBoxDetailReducer from "core/features/currentBoxDetail/currentBoxDetailSlice";
import spotifyLoginReducer from "core/features/spotifyService/spotifyLoginSlice";
import modalReducer from "core/features/modal/modalSlice";
import toastReducer from "core/features/toast/toastSlice";
import currentFolderDetailSlice from "core/features/currentFolderDetail/currentFolderDetailSlice";
import currentUserDetailSlice from "core/features/currentUserDetail/currentUserDetailSlice";

const rootReducer = {
    userData: userReducer,
    userBoxesData: userBoxesReducer,
    userFoldersData: userFoldersReducer,
    userQueueData: userQueueReducer,
    currentBoxDetailData: currentBoxDetailReducer,
    currentFolderDetailData: currentFolderDetailSlice,
    currentUserDetailData: currentUserDetailSlice,
    spotifyLoginData: spotifyLoginReducer,
    modalData: modalReducer,
    toastData: toastReducer
}

export default rootReducer;
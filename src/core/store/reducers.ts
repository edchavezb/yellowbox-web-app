import userReducer from "core/features/user/userSlice";
import userBoxesReducer from "core/features/userBoxes/userBoxesSlice";
import userFoldersReducer from "core/features/userFolders/userFoldersSlice";
import currentBoxDetailReducer from "core/features/currentBoxDetail/currentBoxDetailSlice"
import spotifyLoginReducer from "core/features/spotifyService/spotifyLoginSlice";
import modalReducer from "core/features/modal/modalSlice"

const rootReducer = {
    userData: userReducer,
    userBoxesData: userBoxesReducer,
    userFoldersData: userFoldersReducer,
    currentBoxDetailData: currentBoxDetailReducer,
    spotifyLoginData: spotifyLoginReducer,
    modalData: modalReducer
}

export default rootReducer;
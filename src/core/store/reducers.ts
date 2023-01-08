import userReducer from "core/features/user/userSlice";
import userBoxesReducer from "core/features/userBoxes/userBoxesSlice";
import currentBoxDetailReducer from "core/features/currentBoxDetail/currentBoxDetailSlice"
import spotifyLoginReducer from "core/features/spotifyService/spotifyLoginSlice";
import modalReducer from "core/features/modal/modalSlice"

const rootReducer = {
    userData: userReducer,
    userBoxesData: userBoxesReducer,
    currentBoxDetailData: currentBoxDetailReducer,
    spotifyLoginData: spotifyLoginReducer,
    modalData: modalReducer
}

export default rootReducer;
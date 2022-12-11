import userReducer from "core/features/user/userSlice";
import userBoxesReducer from "core/features/userBoxes/userBoxesSlice";
import spotifyLoginReducer from "core/features/spotifyService/spotifyLoginSlice";
import modalReducer from "core/features/modal/modalSlice"

const rootReducer = {
    userData: userReducer,
    userBoxesData: userBoxesReducer,
    spotifyLoginData: spotifyLoginReducer,
    modalData: modalReducer
}

export default rootReducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserSpotifyAccount, YellowboxUser } from "core/types/interfaces"

interface UserState {
    authenticatedUser: YellowboxUser
    isUserLoggedIn: null | boolean
}

const initialState: UserState = {
    authenticatedUser: {} as YellowboxUser,
    isUserLoggedIn: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthenticatedUser(state, action: PayloadAction<YellowboxUser>) {
            state.authenticatedUser = action.payload
        },
        setIsUserLoggedIn(state, action: PayloadAction<boolean>) {
            state.isUserLoggedIn = action.payload
        },
        updateUserSpotifyAccount(state, action: PayloadAction<UserSpotifyAccount | null>){
            state.authenticatedUser.spotifyAccount = action.payload
        },
        updateUserBasicInfo(state, action: PayloadAction<{firstName: string, lastName: string, username: string, email: string}>){
            const {username, firstName, lastName, email} = action.payload;
            state.authenticatedUser.username = username;
            state.authenticatedUser.firstName = firstName;
            state.authenticatedUser.lastName = lastName;
            state.authenticatedUser.email = email;
        }
    }
})

export const { 
    setAuthenticatedUser,
    setIsUserLoggedIn,
    updateUserSpotifyAccount,
    updateUserBasicInfo
} = userSlice.actions;

export default userSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { YellowboxUser } from "core/types/interfaces"

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
    }
})

export const { 
    setAuthenticatedUser,
    setIsUserLoggedIn
} = userSlice.actions;

export default userSlice.reducer;
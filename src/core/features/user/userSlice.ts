import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserServices, YellowboxUser } from "core/types/interfaces"

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
        updateUserServices(state, action: PayloadAction<UserServices>){
            state.authenticatedUser.services = action.payload
        },
        updateUserBasicInfo(state, action: PayloadAction<{firstName: string, lastName: string, username: string, email: string}>){
            const {username, firstName, lastName, email} = action.payload;
            state.authenticatedUser.username = username;
            state.authenticatedUser.firstName = firstName;
            state.authenticatedUser.lastName = lastName;
            state.authenticatedUser.account.email = email;
        }
    }
})

export const { 
    setAuthenticatedUser,
    setIsUserLoggedIn,
    updateUserServices,
    updateUserBasicInfo
} = userSlice.actions;

export default userSlice.reducer;
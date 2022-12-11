import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { YellowboxUser } from "core/types/interfaces"

interface UserState {
    authenticatedUser: YellowboxUser
}

const initialState: UserState = {
    authenticatedUser: {} as YellowboxUser
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthenticatedUser(state, action: PayloadAction<YellowboxUser>) {
            state.authenticatedUser = action.payload
        }
    }
})

export const { 
    setAuthenticatedUser
} = userSlice.actions;

export default userSlice.reducer;
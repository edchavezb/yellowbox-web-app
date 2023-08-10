import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SpotifyLoginData } from "core/types/interfaces"

interface SpotifyLoginState {
  userData: SpotifyLoginData
  genericToken: string
}

const initialState: SpotifyLoginState = {
  userData: {
    auth: {
      accessToken: null,
      refreshToken: null
    },
    displayName: '',
    userId: '',
  },
  genericToken: ''
};

const spotifyLoginSlice = createSlice({
  name: 'spotifyLogin',
  initialState,
  reducers: {
    setSpotifyLoginData(state, action: PayloadAction<SpotifyLoginData>) {
      state.userData = action.payload
    },
    setAccessToken(state, action: PayloadAction<{accessToken: string}>) {
      state.userData.auth.accessToken = action.payload.accessToken;
    },
    setGenericToken(state, action: PayloadAction<{genericToken: string}>) {
      state.genericToken = action.payload.genericToken;
    },
  }
})

export const {
  setSpotifyLoginData,
  setAccessToken,
  setGenericToken
} = spotifyLoginSlice.actions;

export default spotifyLoginSlice.reducer;
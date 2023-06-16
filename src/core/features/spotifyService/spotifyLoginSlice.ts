import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SpotifyLoginData } from "core/types/interfaces"

interface SpotifyLoginState {
  data: SpotifyLoginData
}

const initialState: SpotifyLoginState = {
  data: {
    auth: {
      accessToken: null,
      refreshToken: null
    },
    userData: {
      displayName: '',
      userId: '',
    }
  }
};

const spotifyLoginSlice = createSlice({
  name: 'spotifyLogin',
  initialState,
  reducers: {
    setSpotifyLoginData(state, action: PayloadAction<SpotifyLoginData>) {
      state.data = action.payload
    },
    setAccessToken(state, action: PayloadAction<{accessToken: string}>) {
      state.data.auth.accessToken = action.payload.accessToken;
    },
  }
})

export const {
  setSpotifyLoginData,
  setAccessToken
} = spotifyLoginSlice.actions;

export default spotifyLoginSlice.reducer;
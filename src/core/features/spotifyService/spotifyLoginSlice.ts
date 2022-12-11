import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SpotifyLoginData } from "core/types/interfaces"

interface SpotifyLoginState {
  data: SpotifyLoginData
}

const initialState: SpotifyLoginState = {
  data: {
    auth: {
      code: null,
      refreshToken: null
    },
    userData: {
      displayName: '',
      userId: '',
      uri: '',
      image: '',
      email: ''
    }
  }
};

const spotifyLoginSlice = createSlice({
  name: 'spotifyLogin',
  initialState,
  reducers: {
    setSpotifyLoginData(state, action: PayloadAction<SpotifyLoginData>) {
      state.data = action.payload
    }
  }
})

export const {
  setSpotifyLoginData
} = spotifyLoginSlice.actions;

export default spotifyLoginSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { YellowboxUser } from "core/types/interfaces";

interface CurrentUserDetailState {
  user: YellowboxUser | null;
  isUserViewing: boolean;
}

const initialState: CurrentUserDetailState = {
  user: null,
  isUserViewing: false,
};

const currentUserDetailSlice = createSlice({
  name: "currentUserDetail",
  initialState,
  reducers: {
    setCurrentUserDetail(state, action: PayloadAction<{ pageUser: YellowboxUser | null } | null>) {
      state.user = action.payload?.pageUser!;
    },
    setIsUserViewing(state, action: PayloadAction<boolean>) {
      state.isUserViewing = action.payload;
    }
  },
});

export const {
  setIsUserViewing,
  setCurrentUserDetail
} = currentUserDetailSlice.actions;

export default currentUserDetailSlice.reducer;
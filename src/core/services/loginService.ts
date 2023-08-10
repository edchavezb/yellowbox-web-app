import { Auth, User, signOut } from "@firebase/auth";
import { getAuthenticatedUserDataApi, verifyUserEmailAddressApi } from "core/api/users";
import { setSpotifyLoginData } from "core/features/spotifyService/spotifyLoginSlice";
import { setAuthenticatedUser, setIsUserLoggedIn } from "core/features/user/userSlice";
import { getSpotifyLoginData } from "core/helpers/getSpotifyLoginData";
import { AppDispatch } from "core/store/store";
import { SpotifyLoginData, YellowboxUser } from "core/types/interfaces";

export const loginService = async (auth: Auth, authUser: User | null, dispatch: AppDispatch, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  if (authUser) {
    try {
      const autenticateUserResponse = await getAuthenticatedUserDataApi();
      const { appUser } = autenticateUserResponse!;
      if (appUser) {
        dispatch(setAuthenticatedUser(appUser!))
        dispatch(setIsUserLoggedIn(true))

        if (appUser.services?.spotify) {
          const { refreshToken, id: spotifyId } = appUser.services.spotify;
          const spotifyLogin = await getSpotifyLoginData(refreshToken, spotifyId);
          if (spotifyLogin) {
            dispatch(setSpotifyLoginData(spotifyLogin))
          }
        }

        if (appUser.account.emailVerified !== authUser.emailVerified) {
          const verifiedUser = await verifyUserEmailAddressApi(appUser._id);
          if (verifiedUser) {
            dispatch(setAuthenticatedUser(verifiedUser));
          }
        }
      }
      else {
        signOut(auth);
      }
    }
    catch (err) {
      signOut(auth);
    }
  }
  else {
    dispatch(setIsUserLoggedIn(false));
    dispatch(setAuthenticatedUser({} as YellowboxUser));
    dispatch(setSpotifyLoginData({} as SpotifyLoginData));
  }
  setIsLoading(false);
}
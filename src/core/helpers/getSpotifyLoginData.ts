import { refreshSpotifyTokenApi } from "core/api/spotify";

export const getSpotifyLoginData = async (refreshToken: string, spotifyId: string) => {
  const refreshResponse = await refreshSpotifyTokenApi(refreshToken);
  if (refreshResponse) {
    const { access_token: token } = refreshResponse;
    const spotifyLogin = {
      auth: {
        refreshToken,
        accessToken: token
      },
      userData: {
        userId: spotifyId
      }
    }
    return spotifyLogin;
  }
}
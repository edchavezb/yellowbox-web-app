import { useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import querystring from 'querystring'
import { linkUserToSpotifyAccountApi } from 'core/api/users';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { setSpotifyLoginData } from 'core/features/spotifyService/spotifyLoginSlice';
import { getSpotifyUserTokenApi } from 'core/api/spotify';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { setAuthenticatedUser } from 'core/features/user/userSlice';
import { SpotifyLoginData } from 'core/types/interfaces';

function SpotifyAuthSuccess() {
  let location = useLocation();
  let history = useHistory();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userData.authenticatedUser);

  useEffect(() => {
    const getSpotifyLoginData = async (code: string, state: string) => {
      const response = await getSpotifyUserTokenApi(code, state);
      const { access_token, refresh_token } = response!;
      getUserData(access_token, refresh_token)
    }
  
    const getUserData = async (token: string, refresh: string) => {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const { id, display_name } = await response.json()
      const spotifyLogin: SpotifyLoginData = {
        auth: {
          refreshToken: refresh,
          accessToken: token
        },
        displayName: display_name,
        userId: id
      }
      dispatch(setSpotifyLoginData(spotifyLogin))
      const spotifyAccountData = await linkUserToSpotifyAccountApi(user.userId, {refreshToken: refresh, spotifyId: id});
      if (spotifyAccountData) {        
        dispatch(setAuthenticatedUser({...user, spotifyAccount: spotifyAccountData}));
      }
      history.push('/')
    }

    const searchParams = querystring.parse(location.search.split("?")[1])
    const { code, state } = searchParams
    if (code && state) {
      getSpotifyLoginData(code as string, state as string)
    }
  }, [location, history, dispatch])

  return (
    <></>
  )
}

export default SpotifyAuthSuccess;
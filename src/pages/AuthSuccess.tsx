import { useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import querystring from 'querystring'
import { createUser, getUserDataBySpotifyId } from 'core/api/users';
import { YellowboxUser } from 'core/types/interfaces';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { setAuthenticatedUser } from 'core/features/user/userSlice';
import { setSpotifyLoginData } from 'core/features/spotifyService/spotifyLoginSlice';
import { getSpotifyToken } from 'core/api/spotify';

function AuthSuccess() {
  let location = useLocation();
  let history = useHistory();
  const dispatch = useAppDispatch();

  const getspotifyLoginData = async (code: string, state: string) => {
    const response = await getSpotifyToken(code, state);
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
    const {display_name, email, id, images, uri} = await response.json()
    const spotifyLogin = {
      auth: {
        refreshToken: refresh,
        accessToken: token
      },
      userData: {
        userId: id
      }
    }
    let user = await getUserDataBySpotifyId(spotifyLogin.userData.userId)
    if(!user){
      const userObj: Omit<YellowboxUser, '_id'> = {
        displayName: display_name,
        image: images[0].url,
        email: email,
        services: {
          spotify: id
        }
      }
      user = await createUser(userObj)
    }
    dispatch(setSpotifyLoginData(spotifyLogin))
    dispatch(setAuthenticatedUser(user!))
    localStorage.setItem("ybx-spotify-refresh-token", refresh)
    localStorage.setItem("ybx-spotify-user-id", id)
    history.push('/')
  }

  useEffect(() => {
    const searchParams = querystring.parse(location.search.split("?")[1])
    const { code, state } = searchParams
    if (code && state) {
      getspotifyLoginData(code as string, state as string)
    }
  }, [location])

  return (
    <></>
  )
}

export default AuthSuccess;
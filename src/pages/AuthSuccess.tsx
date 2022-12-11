import { useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import querystring from 'querystring'
import credentials from '../keys'
import axios from 'axios';
import { createUser, getUserDataBySpotifyId } from 'core/api/users';
import { YellowboxUser } from 'core/types/interfaces';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { setAuthenticatedUser } from 'core/features/user/userSlice';
import { setSpotifyLoginData } from 'core/features/spotifyService/spotifyLoginSlice';

function AuthSuccess() {
  let location = useLocation();
  let history = useHistory();
  const dispatch = useAppDispatch();

  const spotifyAuthorization = (code: string) => {
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        code: code,
        redirect_uri: `${process.env.REACT_APP_PROJECT_ROOT}/authsuccess`,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          `Basic ${Buffer.from(credentials.id + ':' + credentials.secret).toString('base64')}`
      }
    })
      .then(response => {
        getUserData(response.data.access_token, response.data.refresh_token, code)
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getUserData = (token: string, refresh: string, code: string) => {
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async response => {
        console.log(response.data)
        const {display_name, email, id, images, uri} = response.data
        const spotifyLogin = {
          auth: {
            code: code,
            refreshToken: refresh
          },
          userData: {
            displayName: display_name,
            userId: id,
            uri: uri,
            image: images[0].url,
            email: email
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
        history.push('/')
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    const searchParams = querystring.parse(location.search.split("?")[1])
    const { code, state } = searchParams
    spotifyAuthorization(code as string)
    console.log(searchParams)
  }, [location])

  return (
    <></>
  )
}

export default AuthSuccess;
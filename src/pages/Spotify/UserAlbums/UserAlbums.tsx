import GridView from "components/box-views/GridView/GridView";
import { refreshSpotifyTokenApi } from "core/api/spotify";
import { setAccessToken } from "core/features/spotifyService/spotifyLoginSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { Album } from "core/types/interfaces";
import { useCallback, useEffect, useState } from "react";
import styles from "./UserAlbums.module.css"

const UserAlbums = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const spotifyAuthData = useAppSelector(state => state.spotifyLoginData.userData.auth)
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);

  const fetchSavedAlbums = useCallback(async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/albums?limit=50', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json();
    const albums = data.items.map((item: any) => item.album);
    setSavedAlbums(albums);
  }, [])

  useEffect(() => {
    const getSpotifyData = async () => {
      if (spotifyAuthData?.refreshToken) {
        try {
          const refreshResponse = await refreshSpotifyTokenApi(spotifyAuthData.refreshToken)
          const { access_token: accessToken } = refreshResponse!;
          dispatch(setAccessToken({ accessToken }));
          fetchSavedAlbums(accessToken);
        }
        catch (err) {
          console.log(err)
        }
      }
    }
    getSpotifyData();
  }, [spotifyAuthData?.refreshToken, fetchSavedAlbums, dispatch])

  if (isLoggedIn) {
    return (
      <div className={styles.spotifyWrapper}>
        <div className={styles.userAlbums}>
            <h3> Your saved albums </h3>
            <GridView<Album> data={savedAlbums} />
          </div>
      </div>
    );
  }

  return (
    <></>
  )
}

export default UserAlbums;
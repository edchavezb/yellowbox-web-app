import { refreshSpotifyTokenApi } from "core/api/spotify";
import { setAccessToken } from "core/features/spotifyService/spotifyLoginSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { Album } from "core/types/interfaces";
import { useCallback, useEffect, useState } from "react";
import styles from "./UserTracks.module.css"
import ListView from "components/box-views/ListView/ListView";

const UserTracks = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const spotifyAuthData = useAppSelector(state => state.spotifyLoginData.userData.auth)
  const [savedTracks, setSavedTracks] = useState<Album[]>([]);

  const fetchSavedAlbums = useCallback(async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json();
    const tracks = data.items.map((item: any) => item.track);
    setSavedTracks(tracks);
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
        <div>
            <h3> Your saved tracks </h3>
            <ListView<Album> data={savedTracks} sectionType={'tracks'} />
          </div>
      </div>
    );
  }

  return (
    <></>
  )
}

export default UserTracks;
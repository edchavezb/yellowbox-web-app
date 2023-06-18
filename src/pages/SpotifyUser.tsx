import styles from "./SpotifyUser.module.css"
import { Playlist, Track } from "../core/types/interfaces";
import { useCallback, useEffect, useState } from "react";
import GridView from "../components/box-views/GridView";
import { useAppSelector } from "core/hooks/useAppSelector";
import SpotifyTopItems from "components/box-views/SpotifyTopItems/SpotifyTopItems";
import ListView from "components/box-views/ListView";
import { refreshSpotifyToken } from "core/api/spotify";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { setAccessToken } from "core/features/spotifyService/spotifyLoginSlice";

interface SpotifyUserData {
  display_name: string
  email: string
  images: {}[]
  uri: string
}

function SpotifyUser() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const spotifyAuthData = useAppSelector(state => state.spotifyLoginData.data.auth)
  const [userData, setUserData] = useState<SpotifyUserData>({} as SpotifyUserData);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);

  const getUserData = useCallback(async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const {
      display_name,
      email,
      images,
      uri
    } = await response.json()
    setUserData({ display_name, email, images, uri })
  }, [])

  const getRecentlyPlayed = useCallback(async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json();
    setRecentlyPlayed(data.items.map((item: { track: Track }) => item.track).slice(0, 10))
  }, [])

  const getUserPlaylists = useCallback(async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json();
    setUserPlaylists(data.items)
  }, [])

  useEffect(() => {
    const getSpotifyData = async () => {
      if (spotifyAuthData.refreshToken) {
        try {
          const refreshResponse = await refreshSpotifyToken(spotifyAuthData.refreshToken)
          const { access_token: accessToken } = refreshResponse!;
          dispatch(setAccessToken({ accessToken }));
          getUserData(accessToken)
          getRecentlyPlayed(accessToken)
          getUserPlaylists(accessToken)
        }
        catch (err) {
          console.log(err)
        }
      }
    }
    getSpotifyData();
  }, [spotifyAuthData.refreshToken, getUserData, getRecentlyPlayed, getUserPlaylists, dispatch])

  if (isLoggedIn) {
    return (
      <div className={styles.spotifyWrapper}>
        {
          userData.display_name &&
          <h1> {userData?.display_name?.split(" ")[0]}'s Spotify dashboard </h1>
        }
        <SpotifyTopItems />
        {
          !!recentlyPlayed.length &&
          <div className={styles.recentlyPlayedSection}>
            <h3> Recently played tracks </h3>
            <ListView<Track> data={recentlyPlayed} sectionType={'tracklist'} />
          </div>
        }
        {
          !!userPlaylists.length &&
          <div className={styles.userPlaylistsSection}>
            <h3> Your playlists </h3>
            <GridView<Playlist> data={userPlaylists} />
          </div>
        }
      </div>
    );
  }

  return (
    <></>
  )

}

export default SpotifyUser;
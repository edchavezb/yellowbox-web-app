import styles from "./SpotifyUser.module.css"
import { ApiPlaylist, ApiTrack, Playlist, Track } from "core/types/interfaces";
import { useCallback, useEffect, useState } from "react";
import GridView from "components/box-views/GridView/GridView";
import ListView from "components/box-views/ListView/ListView";
import { useAppSelector } from "core/hooks/useAppSelector";
import SpotifyTopItems from "./TopItems/SpotifyTopItems";
import { refreshSpotifyTokenApi } from "core/api/spotify";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { setAccessToken } from "core/features/spotifyService/spotifyLoginSlice";
import { Text } from '@chakra-ui/react'
import { extractApiData } from "core/helpers/itemDataHandlers";

interface SpotifyUserData {
  display_name: string
  email: string
  images: {}[]
  uri: string
}

function SpotifyUser() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const spotifyAuthData = useAppSelector(state => state.spotifyLoginData.userData.auth)
  const [userData, setUserData] = useState<SpotifyUserData>({} as SpotifyUserData);
  const [recentlyPlayed, setRecentlyPlayed] = useState<ApiTrack[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<ApiPlaylist[]>([]);

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
    setRecentlyPlayed(data?.items?.map((item: { track: ApiTrack }) => item.track).slice(0, 10) || [])
  }, [])

  const getUserPlaylists = useCallback(async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json();
    setUserPlaylists(data?.items || [])
  }, [])

  useEffect(() => {
    const getSpotifyData = async () => {
      if (spotifyAuthData?.refreshToken) {
        try {
          const refreshResponse = await refreshSpotifyTokenApi(spotifyAuthData.refreshToken)
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
  }, [spotifyAuthData?.refreshToken, getUserData, getRecentlyPlayed, getUserPlaylists, dispatch])

  if (isLoggedIn) {
    return (
      <div className={styles.spotifyWrapper}>
        {
          userData.display_name &&
          <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: '10px', marginBottom: "20px" }}> {userData?.display_name?.split(" ")[0]}'s Spotify dashboard </Text>
        }
        <SpotifyTopItems />
        {
          !!recentlyPlayed?.length &&
          <div className={styles.recentlyPlayedSection}>
            <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: '20px', marginBottom: "10px" }}> Recently played tracks </Text>
            <ListView<Track> data={recentlyPlayed.map(track => extractApiData(track)) as Track[]} sectionType={'tracklist'} />
          </div>
        }
        {
          !!userPlaylists.length &&
          <div className={styles.userPlaylistsSection}>
            <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: '20px', marginBottom: "10px" }}> Your playlists </Text>
            <GridView<Playlist> data={userPlaylists.map(playlist => extractApiData(playlist)) as Playlist[]} />
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
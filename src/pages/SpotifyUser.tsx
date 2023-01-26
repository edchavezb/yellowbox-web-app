import styles from "./SpotifyUser.module.css"
import querystring from 'querystring'
import credentials from '../keys'
import axios from 'axios';
import { Playlist, Track } from "../core/types/interfaces";
import { useEffect, useState } from "react";
import GridView from "../components/box-views/GridView";
import { useAppSelector } from "core/hooks/useAppSelector";
import SpotifyTopItems from "components/box-views/SpotifyTopItems/SpotifyTopItems";
import ListView from "components/box-views/ListView";

function SpotifyUser() {
  const spotifyLogin = useAppSelector(state => state.spotifyLoginData.data)
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [authToken, setAuthToken] = useState('')

  useEffect(() => {
    getRefreshedToken();
  }, [])

  const getRefreshedToken = () => {
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: spotifyLogin.auth.refreshToken
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':
          `Basic ${Buffer.from(credentials.id + ':' + credentials.secret).toString('base64')}`
      }
    })
      .then(response => {
        setAuthToken(response.data.access_token)
        getRecentlyPlayed(response.data.access_token)
        getUserPlaylists(response.data.access_token)
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getRecentlyPlayed = (token: string) => {
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me/player/recently-played`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setRecentlyPlayed(response.data.items.map((item: {track: Track}) => item.track).slice(0, 10))
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getUserPlaylists = (token: string) => {
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me/playlists`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setUserPlaylists(response.data.items)
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="main-div">
      <h1> {spotifyLogin.userData.displayName.split(" ")[0]}'s Spotify dashboard </h1>
      {
        authToken && 
        <SpotifyTopItems token={authToken}></SpotifyTopItems>
      }
      { 
        !!recentlyPlayed.length &&
        <div className={styles.recentlyPlayedSection}>
          <h3> Recently played tracks </h3>
          <ListView<Track> data={recentlyPlayed} page={'spotifyUser'} listType={'tracklist'} customSorting={false}/> 
        </div>
      }
      { 
        !!userPlaylists.length &&
        <div className={styles.userPlaylistsSection}>
          <h3> Your playlists </h3>
          <GridView<Playlist> data={userPlaylists} page={'spotifyUser'} customSorting={false}/> 
        </div>
      }
    </div>
  );

}

export default SpotifyUser;
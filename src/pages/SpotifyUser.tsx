import styles from "./SpotifyUser.module.css"
import querystring from 'querystring'
import credentials from '../keys'
import axios from 'axios';
import { Artist, ModalState, Track, User } from "../core/types/interfaces";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import GridView from "../components/box-views/GridView";

interface IProps {
  user: User
  dispatchUser: any
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function SpotifyUser({ dispatchUser, user, toggleModal }: IProps) {

  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);

  useEffect(() => {
    getRefreshedToken(user.auth.code as string);
  }, [])

  const getRefreshedToken = (code: string) => {
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: user.auth.refreshToken
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':
          `Basic ${Buffer.from(credentials.id + ':' + credentials.secret).toString('base64')}`
      }
    })
      .then(response => {
        console.log(response)
        getTopArtists(response.data.access_token)
        getTopTracks(response.data.access_token)
        getRecentlyPlayed(response.data.access_token)
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
        console.log(response.data)
        setRecentlyPlayed(response.data.items.map((item: {track: Track}) => item.track).slice(0, 12))
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getTopArtists = (token: string) => {
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me/top/artists?time_range=short_term`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data)
        setTopArtists(response.data.items.slice(0, 6))
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getTopTracks = (token: string) => {
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me/top/tracks?time_range=short_term`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data)
        setTopTracks(response.data.items.slice(0, 6))
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="main-div">
      <h1> {user.userData.displayName.split(" ")[0]}'s Spotify dashboard </h1>
      { 
        !!topArtists.length &&
        <>
          <h3> Your top artists this month </h3>
          <GridView<Artist> data={topArtists} toggleModal={toggleModal} page={'spotifyUser'} /> 
        </>
      }
      { 
        !!topTracks.length &&
        <>
          <h3> Your top tracks this month </h3>
          <GridView<Track> data={topTracks} toggleModal={toggleModal} page={'spotifyUser'} /> 
        </>
      }
      { 
        !!recentlyPlayed.length &&
        <>
          <h3> Recently played tracks </h3>
          <GridView<Track> data={recentlyPlayed} toggleModal={toggleModal} page={'spotifyUser'} /> 
        </>
      }
    </div>
  );

}

export default SpotifyUser;
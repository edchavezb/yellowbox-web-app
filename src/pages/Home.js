import React, { useState, useEffect } from 'react';
import axios from 'axios'
import querystring from 'querystring'
import credentials from '../keys'

function Home() {

  const [artist, setArtist] = useState('')
  const [spotifyToken, setToken] = useState('')

  useEffect(() => {
    spotifyAuthorization()
  }, []);

  const spotifyAuthorization = () => {
    console.log(credentials.id + ':' + credentials.secret)
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({grant_type: 'client_credentials'}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
        `Basic ${Buffer.from(credentials.id + ':' + credentials.secret).toString('base64')}`
      }
    })
      .then(response => {
        setToken(response.data.access_token)
        console.log(response.data.access_token);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleArtistSearch = () => {
    console.log(artist)
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${spotifyToken}`
      }
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="main-div">
      <h1> This is the Home Page biatch </h1>
      <input type="text" onChange={(e) => setArtist(e.target.value.trim().replace(" ", "+"))}/>
      <button onClick={() => handleArtistSearch()}> Search artist </button>
    </div>
  );
}

export default Home;
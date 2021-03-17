import React, { useState, useEffect } from 'react';
import axios from 'axios'
import querystring from 'querystring'
import credentials from '../keys'

function Home() {

  const [artist, setArtist] = useState('')

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
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleArtistSearch = () => {
    console.log(artist)
  }

  return (
    <div className="main-div">
      <h1> This is the Home Page biatch </h1>
      <input type="text" onChange={(e) => setArtist(e.target.value)}/>
      <button onClick={() => handleArtistSearch(artist)}> Search artist </button>
    </div>
  );
}

export default Home;
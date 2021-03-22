import React, { useState, useEffect } from 'react';
import axios from 'axios'
import querystring from 'querystring'
import credentials from '../keys'

import SearchItem from "../components/SearchItem"
import Layout from "../components/Layout"

import styles from "./Home.module.css"

function Home() {

  const [spotifyToken, setToken] = useState('')
  const [query, setQuery] = useState('')
  const [searchData, setSearchData] = useState({artists: [], albums: [], tracks: []})

  useEffect(() => {
    spotifyAuthorization()
  }, []);

  useEffect(() => console.log(searchData), [searchData]);

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

  const handleSearch = () => {
    console.log(query)
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?q=${query}&type=artist,track,album`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${spotifyToken}`
      }
    })
      .then(response => {
        console.log(response.data)
        setSearchData({artists: response.data.artists.items, 
          albums: response.data.albums.items, 
          tracks: response.data.tracks.items})
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <Layout>
      <div className="main-div">
        <h1> This is the Home Page biatch </h1>
        <input type="text" onChange={(e) => setQuery(e.target.value.trim().replace(" ", "+"))}/>
        <button onClick={() => handleSearch()}> Search something </button>
        <h3> Artists </h3>
        <div className={styles.resultsContainer}>
          {searchData.artists.map((e) => {
            console.log(e)
            return <SearchItem key={e.id} element={e}/>
          })}
        </div>
        <h3> Albums </h3>
        <div className={styles.resultsContainer}>
          {searchData.albums.map((e) => {
            return <SearchItem key={e.id} element={e}/>
          })}
        </div>
        <h3> Tracks </h3>
        <div className={styles.resultsContainer}>
          {searchData.tracks.map((e) => {
            return <SearchItem key={e.id} element={e}/>
          })}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
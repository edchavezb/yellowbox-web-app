import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import querystring from 'querystring'
import credentials from '../keys'

import SearchResults from "./SearchResults"

import styles from "./Search.module.css"
import { ModalState } from '../interfaces';

interface IProps {
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function Search({toggleModal}: IProps) {

  const params = useParams<{query: string}>()
  const [spotifyToken, setToken] = useState('')
  const [searchData, setSearchData] = useState({artists: [], albums: [], tracks: [], playlists:[]})


  useEffect(() => {
    handleSearch(params.query)
  }, [params]);

  useEffect(() => console.log(searchData), [searchData]);

  const handleSearch = (query: string) => {
    if (!spotifyToken) {
      spotifyAuthorization(query);
    } else {
      queryAPI(query, spotifyToken);
    }
  }

  const spotifyAuthorization = (query: string) => {
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
        queryAPI(query, response.data.access_token)
      })
      .catch(error => {
        console.log(error);
      });
  }

  const queryAPI = (query: string, token: string) => {
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?q=${query}&type=artist,track,album,playlist`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data)
        setSearchData({artists: response.data.artists.items, 
          albums: response.data.albums.items, 
          tracks: response.data.tracks.items,
          playlists: response.data.playlists.items})
      })
      .catch(error => {
        console.log(error);
      });
  }

  

  return (
    <div className="main-div">
      <h1> Is this what you're looking for? </h1>
      {searchData.artists.length > 0 && <SearchResults type="Artists" data={searchData.artists.slice(0,12)} toggleModal={toggleModal}/>}
      {searchData.albums.length > 0 && <SearchResults type="Albums" data={searchData.albums.slice(0,12)} toggleModal={toggleModal} />}
      {searchData.tracks.length > 0 && <SearchResults type="Tracks" data={searchData.tracks.slice(0,12)} toggleModal={toggleModal}/>}
      {searchData.playlists.length > 0 && <SearchResults type="Playlists" data={searchData.playlists.slice(0,12)} toggleModal={toggleModal}/>}
    </div>
  );
}

export default Search;
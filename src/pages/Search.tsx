import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import querystring from 'querystring'
import credentials from '../keys'
import SearchResults from "./SearchResults"
import { Album, Artist, Playlist, Track } from '../core/types/interfaces';

interface SearchResultsState {
  artists: Artist[]
  albums: Album[]
  tracks: Track[]
  playlists: Playlist[]
}

function Search() {
  const params = useParams<{query: string}>()
  const [spotifyToken, setToken] = useState('')
  const [searchData, setSearchData] = useState<SearchResultsState>({
    artists: [], albums: [], tracks: [], playlists:[]
  })

  useEffect(() => {
    handleSearch(params.query)
  }, [params]);

  const handleSearch = (query: string) => {
    if (!spotifyToken) {
      spotifyAuthorization(query);
    } else {
      processQuery(query, spotifyToken);
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
        processQuery(query, response.data.access_token);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const processQuery = (query: string, token: string) => {
    const urlIdentifier = '%2Fopen.spotify.com%2F'
    if (query.includes(urlIdentifier)) {
      const identifierString = query.split(urlIdentifier)[1].split('%3F')[0]
      const [itemType, itemId] = identifierString.split('%2F');
      queryItemIdApi(itemType, itemId, token);
    }
    else {
      querySearchAPI(query, token);
    }
  }

  const queryItemIdApi = (type: string, id: string, token: string) => {
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/${type}s/${id}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const item = response.data;
        setSearchData({
          artists: item.type === 'artist' ? [item as Artist] : [], 
          albums: item.type === 'album' ? [item as Album] : [], 
          tracks: item.type === 'track' ? [item as Track] : [],
          playlists: item.type === 'playlist' ? [item as Playlist] : []
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  const querySearchAPI = (query: string, token: string) => {
    axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?q=${query}&type=artist,track,album,playlist`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
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
      {searchData.artists.length > 0 && <SearchResults<Artist> type="Artists" data={searchData.artists.slice(0,12)}/>}
      {searchData.albums.length > 0 && <SearchResults<Album> type="Albums" data={searchData.albums.slice(0,12)}/>}
      {searchData.tracks.length > 0 && <SearchResults<Track> type="Tracks" data={searchData.tracks.slice(0,12)}/>}
      {searchData.playlists.length > 0 && <SearchResults<Playlist> type="Playlists" data={searchData.playlists.slice(0,12)}/>}
    </div>
  );
}

export default Search;
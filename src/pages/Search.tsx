import styles from "./Search.module.css"
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchResults from "./SearchResults"
import { Album, Artist, Playlist, Track } from '../core/types/interfaces';
import { getSpotifyGenericToken } from "core/api/spotify";

interface SearchResultsState {
  artists: Artist[]
  albums: Album[]
  tracks: Track[]
  playlists: Playlist[]
}

function Search() {
  const params = useParams<{ query: string }>()
  const [searchData, setSearchData] = useState<SearchResultsState>({
    artists: [], albums: [], tracks: [], playlists: []
  })

  useEffect(() => {
    const handleSearch = async (query: string) => {
      try {
        const tokenResponse = await getSpotifyGenericToken()!;
        const { access_token: accessToken } = tokenResponse!;
        if (accessToken) {
          const urlIdentifier = '%2Fopen.spotify.com%2F'
          if (query.includes(urlIdentifier)) {
            const identifierString = query.split(urlIdentifier)[1].split('%3F')[0]
            const [itemType, itemId] = identifierString.split('%2F');
            queryItemIdApi(itemType, itemId, accessToken);
          }
          else {
            querySearchAPI(query, accessToken);
          }
        }
      }
      catch (err) {
        console.log(err)
      }
    }

    handleSearch(params.query)
  }, [params]);

  const queryItemIdApi = async (type: string, id: string, token: string) => {
    const response = await fetch(`https://api.spotify.com/v1/${type}s/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      }
    })
    const item = await response.json();
    setSearchData({
      artists: item.type === 'artist' ? [item as Artist] : [],
      albums: item.type === 'album' ? [item as Album] : [],
      tracks: item.type === 'track' ? [item as Track] : [],
      playlists: item.type === 'playlist' ? [item as Playlist] : []
    })
  }

  const querySearchAPI = async (query: string, token: string) => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist,track,album,playlist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      }
    })
    const { artists, albums, tracks, playlists } = await response.json();
    setSearchData({
      artists: artists.items,
      albums: albums.items,
      tracks: tracks.items,
      playlists: playlists.items
    })
  }

  return (
    <div className={styles.searchPage}>
      <h1> Is this what you're looking for? </h1>
      {searchData.artists.length > 0 && <SearchResults<Artist> type="Artists" data={searchData.artists.slice(0, 12)} />}
      {searchData.albums.length > 0 && <SearchResults<Album> type="Albums" data={searchData.albums.slice(0, 12)} />}
      {searchData.tracks.length > 0 && <SearchResults<Track> type="Tracks" data={searchData.tracks.slice(0, 12)} />}
      {searchData.playlists.length > 0 && <SearchResults<Playlist> type="Playlists" data={searchData.playlists.slice(0, 12)} />}
    </div>
  );
}

export default Search;
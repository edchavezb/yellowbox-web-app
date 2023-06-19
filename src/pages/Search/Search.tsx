import styles from "./Search.module.css"
import { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import SearchResults from "./SearchResults/SearchResults"
import { Album, Artist, Playlist, Track } from 'core/types/interfaces';
import { getSpotifyGenericToken } from "core/api/spotify";

interface SearchResultsState {
  artists: Artist[]
  albums: Album[]
  tracks: Track[]
  playlists: Playlist[]
}

function Search() {
  const params = useParams<{ query: string }>()
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState<SearchResultsState>({
    artists: [], albums: [], tracks: [], playlists: []
  })
  const searchTimeout = useRef<number | null>(null);

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

  useEffect(() => {
    window.clearTimeout(searchTimeout.current!);
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    searchTimeout.current = window.setTimeout(() => history.push(`/search/${encodedQuery}`), 500);
  }, [searchQuery])

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
      <div id={styles.searchBox}>
        <div id={styles.inputWrapper}>
          <input id={styles.searchInput} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <img id={styles.searchIcon} src="/icons/search.svg" alt="search"></img>
      </div>
      {
        params.query &&
        <h1> Is this what you're looking for? </h1>
      }
      {searchData.artists.length > 0 && <SearchResults<Artist> type="Artists" data={searchData.artists.slice(0, 12)} />}
      {searchData.albums.length > 0 && <SearchResults<Album> type="Albums" data={searchData.albums.slice(0, 12)} />}
      {searchData.tracks.length > 0 && <SearchResults<Track> type="Tracks" data={searchData.tracks.slice(0, 12)} />}
      {searchData.playlists.length > 0 && <SearchResults<Playlist> type="Playlists" data={searchData.playlists.slice(0, 12)} />}
    </div>
  );
}

export default Search;
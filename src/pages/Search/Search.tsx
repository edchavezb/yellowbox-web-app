import styles from "./Search.module.css"
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import SearchResults from "./SearchResults/SearchResults"
import { Album, ApiAlbum, ApiArtist, ApiPlaylist, ApiTrack, Artist, Playlist, Track } from 'core/types/interfaces';
import { getSpotifyGenericTokenApi } from "core/api/spotify";
import useDebounce from "core/hooks/useDebounce";
import { URL_IDENTIFIER } from "core/constants/constants";
import { Text } from '@chakra-ui/react'
import { extractApiData } from "core/helpers/itemDataHandlers";

interface SearchResultsState {
  artists: Artist[]
  albums: Album[]
  tracks: Track[]
  playlists: Playlist[]
}

function Search() {
  const params = useParams<{ query: string }>()
  const history = useHistory();
  const debouncedSearch = useDebounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchQuery = e.target.value;
      if (searchQuery) {
        const encodedQuery = encodeURIComponent(searchQuery.trim());
        history.push(`/search/${encodedQuery}`);
      }
    }, 500
  );
  const [searchData, setSearchData] = useState<SearchResultsState>({
    artists: [], albums: [], tracks: [], playlists: []
  })

  useEffect(() => {
    const handleSearch = async (query: string) => {
      try {
        const tokenResponse = await getSpotifyGenericTokenApi()!;
        const { access_token: accessToken } = tokenResponse!;
        if (accessToken) {
          if (query?.includes(URL_IDENTIFIER)) {
            const identifierString = query.split(URL_IDENTIFIER)[1].split('%3F')[0]
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

    if (params?.query){
      handleSearch(params.query);
    }
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
      artists: artists.items.map((item: ApiArtist) => extractApiData(item)),
      albums: albums.items.map((item: ApiAlbum) => extractApiData(item)),
      tracks: tracks.items.map((item: ApiTrack) => extractApiData(item)),
      playlists: playlists.items.map((item: ApiPlaylist) => extractApiData(item)),
    })
  }

  return (
    <div className={styles.searchPage}>
      <div id={styles.searchBox}>
        <div id={styles.inputWrapper}>
          <input id={styles.searchInput} type="text" defaultValue={params.query || ""} placeholder={"Artist, Track, Album or Spotify URL"} onChange={debouncedSearch} />
        </div>
        <img id={styles.searchIcon} src="/icons/search.svg" alt="search"></img>
      </div>
      {
        params.query &&
        <Text fontSize={"xl"} fontWeight={"700"} sx={{marginTop: '20px', marginBottom: "20px"}}> Is this what you're looking for? </Text>
      }
      {searchData.artists.length > 0 && <SearchResults<Artist> type="Artists" data={searchData.artists.slice(0, 12)} />}
      {searchData.albums.length > 0 && <SearchResults<Album> type="Albums" data={searchData.albums.slice(0, 12)} />}
      {searchData.tracks.length > 0 && <SearchResults<Track> type="Tracks" data={searchData.tracks.slice(0, 12)} />}
      {searchData.playlists.length > 0 && <SearchResults<Playlist> type="Playlists" data={searchData.playlists.slice(0, 12)} />}
    </div>
  );
}

export default Search;
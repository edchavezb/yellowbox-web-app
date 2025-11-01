import { useState } from 'react';
import { Box, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { getSpotifyGenericTokenApi } from 'core/api/spotify';
import useDebounce from 'core/hooks/useDebounce';
import { Album, ApiAlbum, ApiArtist, ApiPlaylist, ApiTrack, Artist, Playlist, Track } from 'core/types/interfaces';
import { extractApiData } from 'core/helpers/itemDataHandlers';
import ContextSearchResult from 'components/common/ContextSearchResult/ContextSearchResult';
import styles from './ContextSearch.module.css';

type SpotifyItem = Artist | Album | Track | Playlist;
type SpotifyItemType = 'artist' | 'album' | 'track' | 'playlist';

interface ContextSearchProps {
  type: SpotifyItemType;
  targetIndex?: number;
  onItemSelect?: (item: SpotifyItem, targetIndex: number) => void;
}

const isTrack = (item: SpotifyItem): item is Track => item.type === 'track';
const isAlbum = (item: SpotifyItem): item is Album => item.type === 'album';
const isPlaylist = (item: SpotifyItem): item is Playlist => item.type === 'playlist';
const isArtist = (item: SpotifyItem): item is Artist => item.type === 'artist';

const getItemImage = (item: SpotifyItem): string => {
  if (isTrack(item)) return item.albumImages[0]?.url || '/icons/music.svg';
  if (isAlbum(item) || isPlaylist(item) || isArtist(item)) return item.images?.[0]?.url || '/icons/music.svg';
  return '/icons/music.svg';
};

const getItemOwner = (item: SpotifyItem): string => {
  if (isTrack(item) || isAlbum(item)) return item.artists[0]?.name || '';
  if (isPlaylist(item)) return item.ownerDisplayName || '';
  if (isArtist(item)) return 'Artist';
  return '';
};

const ContextSearch = ({ type, targetIndex, onItemSelect }: ContextSearchProps) => {
  const [query, setQuery] = useState('');
  const [searchData, setSearchData] = useState<SpotifyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSearchData([]);
        return;
      }
      handleSearch(searchQuery);
    },
    500
  );

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const tokenResponse = await getSpotifyGenericTokenApi()!;
      const { access_token: accessToken } = tokenResponse!;
      if (accessToken) {
        await querySearchAPI(searchQuery, accessToken);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const querySearchAPI = async (query: string, token: string) => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    const items = data[`${type}s`].items.map((item: ApiArtist | ApiAlbum | ApiTrack | ApiPlaylist) =>
      extractApiData(item)
    );
    setSearchData(items);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const onResultClick = (item: SpotifyItem) => {
    if (onItemSelect && targetIndex !== undefined) {
      onItemSelect(item, targetIndex);
    }
    setQuery('');
    setSearchData([]);
  };

  return (
    <Box className={styles.contextSearchContainer}>
      <Box p={4} borderBottom="1px solid" borderColor="gray.200">
        <InputGroup>
          <InputLeftElement>
            <img src="/icons/search-white.svg" alt="search" style={{ width: '16px', height: '16px' }} />
          </InputLeftElement>
          <Input
            value={query}
            onChange={handleInputChange}
            size="md"
            borderColor="gray.300"
          />
        </InputGroup>
      </Box>
      <Box height="calc(100% - 72px)" overflow="auto" p={2}>
        {searchData.length > 0 && (
          <Box display="flex" flexDirection="column" gap={1}>
            {searchData.map((item) => (
              <ContextSearchResult
                key={item.spotifyId}
                imageUrl={getItemImage(item)}
                name={item.name}
                owner={getItemOwner(item)}
                buttonText={onItemSelect ? "Add" : undefined}
                onButtonClick={() => onResultClick(item)}
              />
            ))}
          </Box>
        )}
        {isLoading && (
          <Box textAlign="center" color="gray.500" py={4}>
            Loading...
          </Box>
        )}
        {!isLoading && query && searchData.length === 0 && (
          <Box textAlign="center" color="gray.500" py={4}>
            No results found
          </Box>
        )}
        {!isLoading && !query && (
          <Box height={'100%'} textAlign="center" color="gray.500" py={4} display={'flex'} alignItems="center" justifyContent="center">
            Search for {type}s
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContextSearch;
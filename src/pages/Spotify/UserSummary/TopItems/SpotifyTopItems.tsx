import { useState, useEffect } from 'react';
import { Album, Track } from 'core/types/interfaces';
import styles from "./SpotifyTopItems.module.css";
import { Artist } from 'core/types/interfaces';
import TopItemsList from './TopItemsList/TopItemsList';
import MostPlayedItem from './MostPlayedItem/MostPlayedItem';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { FormControl, FormLabel } from '@chakra-ui/react';
import AppSelect from 'components/styled/AppSelect/AppSelect';

enum TopItemsSelectItems {
  ALBUMS = 'ALBUMS',
  TRACKS = 'TRACKS',
  ARTISTS = 'ARTISTS'
}

enum TimeRanges {
  SHORT = 'short_term',
  MEDIUM = 'medium_term',
  LONG = 'long_term'
}

interface TopItemsState {
  [TopItemsSelectItems.ARTISTS]: Artist[],
  [TopItemsSelectItems.TRACKS]: Track[],
  [TopItemsSelectItems.ALBUMS]: Album[]
}

const TopItemsInitialState: TopItemsState = {
  [TopItemsSelectItems.ARTISTS]: [],
  [TopItemsSelectItems.TRACKS]: [],
  [TopItemsSelectItems.ALBUMS]: []
}

function SpotifyTopItems() {
  const spotifyAuthData = useAppSelector(state => state.spotifyLoginData.userData.auth)
  const [selectedTop, setSelectedTop] = useState(TopItemsSelectItems.ARTISTS)
  const [selectedTimeRange, setSelectedTimeRange] = useState(TimeRanges.SHORT)
  const [topItems, setTopItems] = useState(TopItemsInitialState);

  useEffect(() => {
    fetchItemsList();
  }, [selectedTop, selectedTimeRange])

  const fetchItemsList = async () => {
    if (selectedTop === TopItemsSelectItems.ARTISTS) {
      const artists = await getTopArtists();
      setTopItems({ ...topItems, [TopItemsSelectItems.ARTISTS]: artists.items })
    }
    else if (selectedTop === TopItemsSelectItems.TRACKS) {
      const tracks = await getTopTracks();
      setTopItems({ ...topItems, [TopItemsSelectItems.TRACKS]: tracks.items })
    }
    else if (selectedTop === TopItemsSelectItems.ALBUMS) {
      const tracks = await getTopTracks();
      const albums = computeTopAlbums(tracks.items);
      setTopItems({ ...topItems, [TopItemsSelectItems.ALBUMS]: albums })
    }
  }

  const getTopArtists = async () => {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${selectedTimeRange}`,
      {
        headers: {
          'Authorization': `Bearer ${spotifyAuthData.accessToken}`
        }
      }
    )
    return await response.json();
  }

  const getTopTracks = async () => {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${selectedTimeRange}`,
      {
        headers: {
          'Authorization': `Bearer ${spotifyAuthData.accessToken}`
        }
      }
    )
    return await response.json();
  }

  const computeTopAlbums = (tracks: Track[]) => {
    const allAlbums = tracks.map(track => track.album!).filter(album => album.album_type !== 'SINGLE');
    const scoreBoard: { [key: string]: number } = {}
    allAlbums.forEach(album => {
      const id = album?.id!;
      if (!Object.keys(scoreBoard).includes(id)) {
        scoreBoard[id] = 1;
      } else {
        scoreBoard[id]++
      }
    })
    const uniqueAlbums = allAlbums.reduce<Album[]>((acc, curr) =>
      acc.some(album => album.id === curr!.id) ? acc : [...acc, curr]
      , [])
    const sortedAlbums = uniqueAlbums.sort((a, b) => {
      const countA = scoreBoard[a?.id!]
      const countB = scoreBoard[b?.id!]
      if (countA > countB) {
        return -1;
      }
      if (countA < countB) {
        return 1;
      }
      return 0;
    })
    return sortedAlbums as Album[]
  }

  return (
    <div className={styles.topItemsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span> Top </span>
          <AppSelect
            value={selectedTop}
            onChange={(e) => setSelectedTop(e.target.value as TopItemsSelectItems)}
          >
            <>
              <option value={TopItemsSelectItems.ARTISTS}> artists </option>
              <option value={TopItemsSelectItems.ALBUMS}> albums </option>
              <option value={TopItemsSelectItems.TRACKS}> tracks </option>
            </>
          </AppSelect>
          <span> in your library </span>
        </div>
        <div className={styles.timeRangeSelect}>
          <span> Time Range </span>
          <AppSelect
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as TimeRanges)}
          >
            <>
              <option value={TimeRanges.SHORT}> Last 4 weeks </option>
              <option value={TimeRanges.MEDIUM}> Last 6 months </option>
              <option value={TimeRanges.LONG}> Last year </option>
            </>
          </AppSelect>
        </div>
      </div>
      {
        !!topItems[selectedTop]?.length &&
        <div className={styles.topItemsColumnsWrapper}>
          <div className={styles.mostPlayedColumn}>
            <MostPlayedItem item={topItems[selectedTop][0]} type={selectedTop} />
          </div>
          <div className={styles.topItemsColumn}>
            <TopItemsList items={topItems[selectedTop].slice(0, 10)} type={selectedTop} />
          </div>
        </div>
      }
    </div>
  )
}

export default SpotifyTopItems;
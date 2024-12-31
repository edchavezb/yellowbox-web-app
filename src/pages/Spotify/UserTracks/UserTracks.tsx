import { refreshSpotifyTokenApi } from "core/api/spotify";
import { setAccessToken } from "core/features/spotifyService/spotifyLoginSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { Album, ApiTrack, Track } from "core/types/interfaces";
import { useCallback, useEffect, useState } from "react";
import styles from "./UserTracks.module.css"
import ListView from "components/box-views/ListView/ListView";
import PageSwitcher from "components/common/Pagination/PageSwitcher";
import { Text } from '@chakra-ui/react'
import { extractApiData } from "core/helpers/itemDataHandlers";

const UserTracks = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const spotifyAuthData = useAppSelector(state => state.spotifyLoginData.userData.auth)
  const [isFetching, setIsFetching] = useState(true);
  const [page, setPage] = useState(1);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [savedTracks, setSavedTracks] = useState<ApiTrack[]>([]);

  const fetchSavedAlbums = useCallback(async (token: string) => {
    const response = await fetch(`https://api.spotify.com/v1/me/tracks?offset=${(page - 1) * 50}&limit=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json();
    const { previous, next } = data;
    const tracks = data.items.map((item: any) => item.track);
    setHasPrevious(!!previous);
    setHasNext(!!next);
    setSavedTracks(tracks);
    setIsFetching(false);
  }, [page])

  const handleDecrementPage = () => {
    if (hasPrevious && !isFetching) {
      setIsFetching(true);
      setPage(page - 1)
    }
  }

  const handleIncrementPage = () => {
    if (hasNext && !isFetching) {
      setIsFetching(true);
      setPage(page + 1)
    }
  }

  useEffect(() => {
    const getSpotifyData = async () => {
      if (spotifyAuthData?.refreshToken) {
        try {
          const refreshResponse = await refreshSpotifyTokenApi(spotifyAuthData.refreshToken)
          const { access_token: accessToken } = refreshResponse!;
          dispatch(setAccessToken({ accessToken }));
          fetchSavedAlbums(accessToken);
        }
        catch (err) {
          console.log(err)
        }
      }
    }
    getSpotifyData();
  }, [spotifyAuthData?.refreshToken, fetchSavedAlbums, dispatch])

  if (isLoggedIn) {
    return (
      <div className={styles.spotifyWrapper}>
        <div>
          <div className={styles.titlePageRow}>
            <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: '15px', marginBottom: "10px" }}>
              Your saved tracks
            </Text>
            <PageSwitcher pageNumber={page} decrementHandler={handleDecrementPage} incrementHandler={handleIncrementPage} hasPrevious={isFetching ? false : hasPrevious} hasNext={isFetching ? false : hasNext} />
          </div>
          <ListView<Track> data={savedTracks.map(track => extractApiData(track)) as Track[]} offset={(page - 1) * 50} sectionType={'tracks'} />
        </div>
      </div>
    );
  }

  return (
    <></>
  )
}

export default UserTracks;
import GridView from "components/box-views/GridView/GridView";
import PageSwitcher from "components/common/Pagination/PageSwitcher";
import { refreshSpotifyTokenApi } from "core/api/spotify";
import { setAccessToken } from "core/features/spotifyService/spotifyLoginSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { Album } from "core/types/interfaces";
import { useCallback, useEffect, useState } from "react";
import styles from "./UserAlbums.module.css"
import { Text } from '@chakra-ui/react'

const UserAlbums = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const spotifyAuthData = useAppSelector(state => state.spotifyLoginData.userData.auth)
  const [isFetching, setIsFetching] = useState(true);
  const [page, setPage] = useState(1);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);

  const fetchSavedAlbums = useCallback(async (token: string) => {
    const response = await fetch(`https://api.spotify.com/v1/me/albums?offset=${(page - 1) * 48}&limit=48`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json();
    const { previous, next } = data;
    const albums = data.items.map((item: any) => item.album);
    setHasPrevious(!!previous);
    setHasNext(!!next);
    setSavedAlbums(albums);
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
        <div className={styles.userAlbums}>
          <div className={styles.titlePageRow}>
            <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: '15px', marginBottom: "10px" }}>
              Your saved albums
            </Text>
            <PageSwitcher pageNumber={page} decrementHandler={handleDecrementPage} incrementHandler={handleIncrementPage} hasPrevious={isFetching ? false : hasPrevious} hasNext={isFetching ? false : hasNext} />
          </div>
          <GridView<Album> data={savedAlbums} />
        </div>
      </div>
    );
  }

  return (
    <></>
  )
}

export default UserAlbums;
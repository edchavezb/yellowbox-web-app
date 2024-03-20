import { useState, useEffect, useMemo, useRef } from 'react';
import BoxSection from './BoxSection/BoxSection';
import styles from "./BoxDetail.module.css";
import { Album, Artist, Playlist, Track, Visibility } from 'core/types/interfaces';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { fetchBoxDetailThunk, setIsUserViewing } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useParams } from 'react-router-dom';
import PopperMenu from 'components/menus/popper/PopperMenu';
import BoxMenu from 'components/menus/popper/BoxMenu/BoxMenu';
import { getSpotifyGenericTokenApi } from 'core/api/spotify';
import { setGenericToken } from 'core/features/spotifyService/spotifyLoginSlice';
import { Text } from '@chakra-ui/react'

function BoxDetail() {
  const { id: boxId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const menuToggleRef = useRef(null);
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const spotifyLoginData = useAppSelector(state => state.spotifyLoginData);
  const spotifyToken = spotifyLoginData?.genericToken;
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const isBoxEmpty = useMemo(
    () => currentBox?.albums?.length === 0 && currentBox?.artists?.length === 0 && currentBox?.tracks?.length === 0 && currentBox?.playlists?.length === 0,
    [currentBox]
  );
  const [visibility, setVisibility] = useState<Visibility>({ playlists: true, albums: true, artists: true, tracks: true })
  const [isBoxMenuOpen, setIsBoxMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBoxDetailThunk(boxId))
    dispatch(setIsUserViewing(true))
    return () => {
      dispatch(setIsUserViewing(false))
    }
  }, [boxId, dispatch])

  useEffect(() => {
    if (!spotifyToken) {
      setSpotifyToken();
    }
  }, [spotifyToken])

  const setSpotifyToken = async () => {
    const tokenResponse = await getSpotifyGenericTokenApi()!;
    const { access_token: accessToken } = tokenResponse!;
    if (accessToken) {
      dispatch(setGenericToken({ genericToken: accessToken }));
    }
  }

  return (
    <>
      {
        (isLoggedIn !== null && currentBox._id === boxId) &&
        <div id={styles.mainPanel}>
          <div className={styles.boxHeader}>
            <div className={styles.boxSquare}>
              <img className={styles.boxIcon} src="/icons/box.svg" alt="box" />
            </div>
            <div className={styles.boxInfo}>
              <Text fontSize={"2xl"} fontWeight={"700"}> {currentBox?.name} </Text>
              <div id={styles.boxDesc}>
                {`${currentBox?.description}`}
              </div>
              <div className={styles.creator}>
                Box by <span className={styles.creatorName}>{currentBox.creatorName}</span>
              </div>
            </div>
            <div className={styles.menuButtonWrapper}>
              <div className={styles.menuButton} onClick={() => setIsBoxMenuOpen(true)} ref={menuToggleRef}>
                <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
              </div>
            </div>
          </div>
          {!!currentBox?.artists?.length &&
            <BoxSection<Artist>
              type="artists"
              visible={visibility.artists} />
          }
          {!!currentBox?.albums?.length &&
            <BoxSection<Album>
              type="albums"
              visible={visibility.albums} />
          }
          {!!currentBox?.tracks?.length &&
            <BoxSection<Track>
              type="tracks"
              visible={visibility.tracks} />
          }
          {!!currentBox?.playlists?.length &&
            <BoxSection<Playlist>
              type="playlists"
              visible={visibility.playlists} />
          }
          {isBoxEmpty &&
            <div id={styles.emptyMsgDiv}>
              <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: '10px', marginBottom: "20px", textAlign: "center" }}>
                You have not added any items to this box yet. <br /> Start by searching some music you like!
              </Text>
            </div>}
        </div>
      }
      <PopperMenu referenceRef={menuToggleRef} placement={'bottom-start'} isOpen={isBoxMenuOpen} setIsOpen={setIsBoxMenuOpen}>
        <BoxMenu setIsOpen={setIsBoxMenuOpen} />
      </PopperMenu>
    </>
  )
}

export default BoxDetail;
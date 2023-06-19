import { useState, useEffect, useMemo } from 'react';
import BoxUtilities from './BoxUtilities/BoxUtilities';
import BoxSection from './BoxSection/BoxSection';
import styles from "./BoxDetail.module.css";
import { Album, Artist, Playlist, Track, Visibility } from 'core/types/interfaces';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { fetchBoxDetailThunk, setIsUserViewing } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useParams } from 'react-router-dom';

function BoxDetail() {
  const { id: boxId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const isBoxEmpty = useMemo(
    () => currentBox?.albums?.length === 0 && currentBox?.artists?.length === 0 && currentBox?.tracks?.length === 0 && currentBox?.playlists?.length === 0,
    [currentBox]
  );
  const singleTypeBox = useMemo(
    () => [currentBox?.albums, currentBox?.artists, currentBox?.tracks, currentBox?.playlists].filter((section) => section?.length > 0).length === 1,
    [currentBox]
  );
  const [visibility, setVisibility] = useState<Visibility>({ playlists: true, albums: true, artists: true, tracks: true })

  useEffect(() => {
    dispatch(fetchBoxDetailThunk(boxId))
    dispatch(setIsUserViewing(true))
    return () => {
      dispatch(setIsUserViewing(false))
    }
  }, [boxId, dispatch])

  return (
    <>
      {
        (isLoggedIn !== null && currentBox._id === boxId) &&
        <div id={styles.mainPanel}>
          <BoxUtilities
            box={currentBox}
            singleTypeBox={singleTypeBox}
            visibility={visibility}
            setVisibility={setVisibility}
          />
          <h2 id={styles.boxName}> {currentBox?.name} </h2>
          <div id={styles.boxDesc}> {currentBox?.description} </div>
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
          {isBoxEmpty && <div id={styles.emptyMsgDiv}><h3 id={styles.emptyMsg}> You have not added any items to this box yet. <br /> Start by searching some music you like! </h3></div>}
        </div>
      }
    </>
  )
}

export default BoxDetail;
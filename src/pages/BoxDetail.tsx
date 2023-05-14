import { useState, useEffect } from 'react';
import BoxUtilities from '../components/box-views/BoxUtilities';
import BoxSection from '../components/box-views/BoxSection';
import styles from "./BoxDetail.module.css";
import { Album, Artist, Playlist, Track, Visibility } from '../core/types/interfaces';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { fetchBoxDetailThunk, setIsUserViewing } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useParams } from 'react-router-dom';

function BoxDetail() {
  const { id: boxId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box)
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const [boxMetaData, setBoxMetaData] = useState({ isOwner: false, boxNotEmpty: false, singleTypeBox: true })
  const [visibility, setVisibility] = useState<Visibility>({ playlists: true, albums: true, artists: true, tracks: true })

  useEffect(() => {
    dispatch(fetchBoxDetailThunk(boxId))
    dispatch(setIsUserViewing(true))
    return () => {
      dispatch(setIsUserViewing(false))
    }
  }, [boxId])

  useEffect(() => {
    boxDetailsInit()
  }, [currentBox])

  const boxDetailsInit = () => {
    if (currentBox._id) {
      const isOwner = !!userBoxes.find(box => box.boxId === currentBox?._id);
      const boxNotEmpty = currentBox?.albums?.length > 0 || currentBox?.artists?.length > 0 || currentBox?.tracks?.length > 0 || currentBox?.playlists?.length > 0;
      const singleTypeBox = [currentBox?.albums, currentBox?.artists, currentBox?.tracks, currentBox?.playlists].filter((section) => section?.length > 0).length === 1;
      setBoxMetaData({ isOwner, boxNotEmpty, singleTypeBox })
      setVisibility(currentBox.sectionVisibility)
    }
  }

  return (
    <div id={styles.mainPanel}>
      <BoxUtilities
        box={currentBox}
        singleTypeBox={boxMetaData.singleTypeBox}
        visibility={visibility}
        setVisibility={setVisibility}
      />
      <h2 id={styles.boxName}> {currentBox?.name} </h2>
      <div id={styles.boxDesc}> {currentBox?.description} </div>
      {currentBox?.artists?.length ?
        <BoxSection<Artist>
          isOwner={boxMetaData.isOwner}
          type="Artists"
          box={currentBox}
          data={currentBox.artists}
          sorting={currentBox.sectionSorting.artists}
          visible={visibility.artists} />
        : ""}
      {currentBox?.albums?.length ?
        <BoxSection<Album>
          isOwner={boxMetaData.isOwner}
          type="Albums"
          box={currentBox}
          data={currentBox.albums}
          sorting={currentBox.sectionSorting.albums}
          visible={visibility.albums} />
        : ""}
      {currentBox?.tracks?.length ?
        <BoxSection<Track>
          isOwner={boxMetaData.isOwner}
          type="Tracks"
          box={currentBox}
          data={currentBox.tracks}
          sorting={currentBox.sectionSorting.tracks}
          visible={visibility.tracks} />
        : ""}
      {currentBox?.playlists?.length ?
        <BoxSection<Playlist>
          isOwner={boxMetaData.isOwner}
          type="Playlists"
          box={currentBox}
          data={currentBox.playlists}
          sorting={currentBox.sectionSorting.playlists}
          visible={visibility.playlists} />
        : ""}
      {boxMetaData.boxNotEmpty ? "" : <div id={styles.emptyMsgDiv}><h3 id={styles.emptyMsg}> You have not added any items to this box yet. <br /> Start by searching some music you like! </h3></div>}
    </div>
  )
}

export default BoxDetail;
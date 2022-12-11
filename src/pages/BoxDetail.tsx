import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BoxUtilities from '../components/box-views/BoxUtilities';
import BoxSection from '../components/box-views/BoxSection';
import styles from "./BoxDetail.module.css";
import { Album, Artist, Playlist, Track, UserBox, Visibility } from '../core/types/interfaces';
import { getBoxByIdApi } from '../core/api/userboxes';
import { useAppSelector } from 'core/hooks/useAppSelector';

function BoxDetail() {
  const {id} = useParams<{id: string}>()
  const userBoxes = useAppSelector(state => state.userBoxesData.boxes)
  const [boxData, setBoxData] = useState<UserBox | null>(null)
  const [boxMetaData, setBoxMetaData] = useState({isOwner: false, boxNotEmpty: false, singleTypeBox: true})
  const [visibility, setVisibility] = useState<Visibility>({playlists: true, albums: true, artists: true, tracks: true})

  useEffect(() => {
    fetchBoxData()
  }, [id])

  useEffect(() => {
    console.log(visibility)
    console.log(boxData)
  }, [visibility])

  const fetchBoxData = async () => {
    const data = await getBoxByIdApi(id)
    if (data) {
      const isOwner = !!userBoxes.find(box => box._id === id);
      const boxNotEmpty = data?.albums.length > 0 || data?.artists.length > 0 || data?.tracks.length > 0 || data?.playlists.length > 0;
      const singleTypeBox = [data.albums, data.artists, data.tracks].filter((section) => section.length > 0).length === 1;
      setBoxMetaData({isOwner, boxNotEmpty, singleTypeBox})
      setBoxData(data as UserBox)
      if (isOwner){
        setVisibility(data.sectionVisibility)
      }
    }
  }

  return (
    <div id={styles.mainPanel}>
      {boxData && boxMetaData.boxNotEmpty && boxMetaData.isOwner ? 
        <BoxUtilities 
          box={boxData} 
          singleTypeBox={boxMetaData.singleTypeBox} 
          visibility={visibility} 
          setVisibility={setVisibility}
        /> 
        : 
        ""
      }
      <h2 id={styles.boxName}> {boxData?.name} </h2>
      <div id={styles.boxDesc}> {boxData?.description} </div>
      {boxData?.artists?.length ? 
        <BoxSection<Artist> 
          isOwner={boxMetaData.isOwner}
          type="Artists"
          box={boxData}
          data={boxData.artists} 
          sorting={boxData.sectionSorting.artists}
          visible={visibility.artists} />
        : ""}
      {boxData?.albums?.length ? 
        <BoxSection<Album>
          isOwner={boxMetaData.isOwner}
          type="Albums" 
          box={boxData} 
          data={boxData.albums}
          sorting={boxData.sectionSorting.albums}
          visible={visibility.albums} /> 
        : ""}
      {boxData?.tracks?.length ? 
        <BoxSection<Track>
          isOwner={boxMetaData.isOwner}
          type="Tracks" 
          box={boxData} 
          data={boxData.tracks}
          sorting={boxData.sectionSorting.tracks}
          visible={visibility.tracks} /> 
        : ""}
        {boxData?.playlists?.length ? 
        <BoxSection<Playlist> 
          isOwner={boxMetaData.isOwner}
          type="Playlists" 
          box={boxData} 
          data={boxData.playlists}
          sorting={boxData.sectionSorting.playlists}
          visible={visibility.playlists} /> 
        : ""}
      {boxMetaData.boxNotEmpty ? "" : <div id={styles.emptyMsgDiv}><h3 id={styles.emptyMsg}> You have not added any items to this box yet. <br/> Start by searching some music you like! </h3></div>}
    </div>
  )
}

export default BoxDetail;
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';

import BoxUtilities from '../components/box-views/BoxUtilities';
import BoxSection from '../components/box-views/BoxSection';
import styles from "./BoxDetail.module.css";
import { Album, Artist, ModalState, Playlist, Track, UserBox, Visibility } from '../interfaces';

interface IProps {
	userBoxes: UserBox[]
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function BoxDetail({userBoxes, toggleModal}: IProps) {

  const params = useParams<{id: string}>()
  const boxCopy = JSON.parse(JSON.stringify(userBoxes.find(box => box.id === params.id)))
  const boxNotEmpty = boxCopy.albums.length > 0 || boxCopy.artists.length > 0 || boxCopy.tracks.length > 0 || boxCopy.playlists.length > 0;
  const singleTypeBox = [boxCopy.albums, boxCopy.artists, boxCopy.tracks].filter((section) => section.length > 0).length === 1

  const [visibility, setVisibility] = useState<Visibility>({...boxCopy.sectionVisibility})

  useEffect(() => {
    console.log(visibility)
    console.log(boxCopy)
  }, [visibility])

  return (
    <div id={styles.mainPanel}>
      {boxNotEmpty ? 
        <BoxUtilities 
          box={boxCopy} 
          singleTypeBox={singleTypeBox} 
          visibility={visibility} 
          setVisibility={setVisibility}
          toggleModal={toggleModal}
          /> 
        : ""}
      <h2 id={styles.boxName}> {boxCopy.name} </h2>
      <div id={styles.boxDesc}> {boxCopy.description} </div>
      {boxCopy.artists.length ? 
        <BoxSection<Artist> 
          type="Artists"
          box={boxCopy}
          data={boxCopy.artists} 
          sorting={boxCopy.sectionSorting.artists}
          visible={visibility.artists}
          toggleModal={toggleModal} />
        : ""}
      {boxCopy.albums.length ? 
        <BoxSection<Album>
          type="Albums" 
          box={boxCopy} 
          data={boxCopy.albums}
          sorting={boxCopy.sectionSorting.albums}
          visible={visibility.albums}
          toggleModal={toggleModal}  /> 
        : ""}
      {boxCopy.tracks.length ? 
        <BoxSection<Track> 
          type="Tracks" 
          box={boxCopy} 
          data={boxCopy.tracks}
          sorting={boxCopy.sectionSorting.tracks}
          visible={visibility.tracks}
          toggleModal={toggleModal}  /> 
        : ""}
        {boxCopy.playlists.length ? 
        <BoxSection<Playlist> 
          type="Playlists" 
          box={boxCopy} 
          data={boxCopy.playlists}
          sorting={boxCopy.sectionSorting.playlists}
          visible={visibility.playlists}
          toggleModal={toggleModal}  /> 
        : ""}
      {boxNotEmpty ? "" : <div id={styles.emptyMsgDiv}><h3 id={styles.emptyMsg}> You have not added any items to this box yet. <br/> Start by searching some music you like! </h3></div>}
    </div>
  )
}

export default BoxDetail;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BoxUtilities from '../components/BoxUtilities';
import BoxSection from '../components/BoxSection';
import styles from "./BoxDetail.module.css";

function BoxDetail(props) {

  const toggleModal = props.toggleModal
  const params = useParams()
  const boxCopy = JSON.parse(JSON.stringify(props.userBoxes.find(box => box.id === params.id)))
  const boxNotEmpty = boxCopy.albums.length > 0 || boxCopy.artists.length > 0 || boxCopy.tracks.length > 0;
  const singleTypeBox = [boxCopy.albums, boxCopy.artists, boxCopy.tracks].filter((section) => section.length > 0).length === 1

  const [visibility, setVisibility] = useState({...boxCopy.sectionVisibility})

  useEffect(() => {
    console.log(visibility)
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
        <BoxSection 
          type="Artists"
          box={boxCopy}
          data={boxCopy.artists} 
          sorting={boxCopy.sectionSorting.artists}
          visible={visibility.artists}
          toggleModal={toggleModal} />
        : ""}
      {boxCopy.albums.length ? 
        <BoxSection 
          type="Albums" 
          box={boxCopy} 
          data={boxCopy.albums}
          sorting={boxCopy.sectionSorting.albums}
          visible={visibility.albums}
          toggleModal={toggleModal}  /> 
        : ""}
      {boxCopy.tracks.length ? 
        <BoxSection 
          type="Tracks" 
          box={boxCopy} 
          data={boxCopy.tracks}
          sorting={boxCopy.sectionSorting.tracks}
          visible={visibility.tracks}
          toggleModal={toggleModal}  /> 
        : ""}
      {boxNotEmpty ? "" : <div id={styles.emptyMsgDiv}><h3 id={styles.emptyMsg}> You have not added any items to this box yet. <br/> Start by searching some music you like! </h3></div>}
    </div>
  )
}

export default BoxDetail;
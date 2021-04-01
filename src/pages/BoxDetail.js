import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BoxUtilities from '../components/BoxUtilities';
import BoxSection from '../components/BoxSection';
import styles from "./BoxDetail.module.css";

function BoxDetail(props) {

  const params = useParams()
  const boxCopy = {...props.userBoxes.find(box => box.id === params.id)}
  const boxNotEmpty = boxCopy.albums.length > 0 || boxCopy.artists.length > 0 || boxCopy.tracks.length > 0;
  const singleTypeBox = [boxCopy.albums, boxCopy.artists, boxCopy.tracks].filter((box) => box.length > 0).length === 1

  const [visibility, setVisibility] = useState({...boxCopy.sectionVisibility})
  const [boxSorting, setBoxSorting] = useState({...boxCopy.sorting})

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
          boxSorting={boxSorting}
          setBoxSorting={setBoxSorting}/> 
        : ""}
      <h2> {boxCopy.name} </h2>
      <p> {boxCopy.description} </p>
      {boxCopy.artists.length ? <BoxSection type="Artists" data={boxCopy.artists} visible={visibility.artists} /> : ""}
      {boxCopy.albums.length ? <BoxSection type="Albums" data={boxCopy.albums} visible={visibility.albums} /> : ""}
      {boxCopy.tracks.length ? <BoxSection type="Tracks" data={boxCopy.tracks} visible={visibility.tracks} /> : ""}
      {boxNotEmpty ? "" : <h3> You have not added any items to this box yet. Start by searching some music you like! </h3>}
    </div>
  )
}

export default BoxDetail;
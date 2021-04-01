import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BoxUtilities from '../components/BoxUtilities';
import BoxSection from '../components/BoxSection';
import styles from "./BoxDetail.module.css";

function BoxDetail(props) {

  const params = useParams()
  const box = props.userBoxes.find(box => box.id === params.id)
  const boxNotEmpty = box.albums.length > 0 || box.artists.length > 0 || box.tracks.length > 0;
  const singleTypeBox = [box.albums, box.artists, box.tracks].filter((box) => box.length > 0).length === 1

  const [visibility, setVisibility] = useState({artists: true, albums: true, tracks: true})
  const [boxSorting, setBoxSorting] = useState({artists: "custom", albums: "custom", tracks: "custom"})

  useEffect(() => {
    console.log(visibility)
  }, [visibility])

  return (
    <div id={styles.mainPanel}>
      {boxNotEmpty ? <BoxUtilities box={box} singleTypeBox={singleTypeBox} visibility={visibility} setVisibility={setVisibility}/> : ""}
      <h2> {box.name} </h2>
      <p> {box.description} </p>
      {box.artists.length ? <BoxSection type="Artists" data={box.artists} visible={visibility.artists} /> : ""}
      {box.albums.length ? <BoxSection type="Albums" data={box.albums} visible={visibility.albums} /> : ""}
      {box.tracks.length ? <BoxSection type="Tracks" data={box.tracks} visible={visibility.tracks} /> : ""}
      {boxNotEmpty ? "" : <h3> You have not added any items to this box yet. Start by searching some music you like! </h3>}
    </div>
  )
}

export default BoxDetail;
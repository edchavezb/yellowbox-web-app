import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BoxSection from '../components/BoxSection';
import styles from "./BoxDetail.module.css";

function BoxDetail(props) {

  console.log(props.userBoxes)
  const params = useParams()
  const box = props.userBoxes.find(box => box.id === params.id)
  const boxNotEmpty = box.albums.length > 0 || box.artists.length > 0 || box.tracks.length > 0;
  const singleTypeBox = [box.albums, box.artists, box.tracks].filter((box) => box.length > 0).length === 1

  console.log(singleTypeBox)

  const [visibility, setVisibility] = useState({artists: true, albums: true, tracks: true})

  const handleSectionVisibility = e => {
    const section = e.currentTarget.getAttribute("handles")
    let newVisibility = {}
    if (visibility[section]){
      newVisibility[section] = false
    }
    else 
      newVisibility[section] = true
    setVisibility(state => ({...state, ...newVisibility}))
  }

  const includeToggler = () => {
    
  }

  useEffect(() => {
    console.log(visibility)
  }, [visibility])

  return (
    <div id={styles.mainPanel}>
      {boxNotEmpty ? 
        <div id={styles.boxUtilities}>
          <div id={singleTypeBox ? styles.noInclude : styles.includeToggler}> 
            <span id={styles.includeTitle}> Include </span>
            {box.artists.length ? 
              <div className={visibility.artists ? styles.includeButton : styles.includeButtonPressed} onClick={(e) => handleSectionVisibility(e)} handles="artists"> 
                <img className={styles.buttonIcon} src="/icons/artist.svg" /> 
              </div> 
              : ""}
            {box.albums.length ? 
              <div className={visibility.albums ? styles.includeButton : styles.includeButtonPressed} onClick={(e) => handleSectionVisibility(e)} handles="albums"> 
                <img className={styles.buttonIcon} src="/icons/album.svg" /> 
              </div>  
              : ""}
            {box.tracks.length ? 
              <div className={visibility.tracks ? styles.includeButton : styles.includeButtonPressed} onClick={(e) => handleSectionVisibility(e)} handles="tracks"> 
                <img className={styles.buttonIcon} src="/icons/song.svg" /> 
              </div>  
              : ""}
          </div>
        </div>
      : ""}
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
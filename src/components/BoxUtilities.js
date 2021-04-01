import React, { useState, useEffect } from 'react';

import styles from "./BoxUtilities.module.css";

function BoxUtilities(props) {

  const box = props.box
  const singleTypeBox = props.singleTypeBox
  const visibility = props.visibility
  const setVisibility = props.setVisibility
  const boxSorting = props.boxSorting
  const setBoxSorting = props.setBoxSorting

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

  return (
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
      <button id={styles.sortingButton}> Sorting Options </button>
    </div>
  )
}

export default BoxUtilities;
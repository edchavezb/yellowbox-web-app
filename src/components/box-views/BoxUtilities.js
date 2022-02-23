import React, { useState, useEffect } from 'react';

import styles from "./BoxUtilities.module.css";

function BoxUtilities({box, singleTypeBox, visibility, setVisibility, toggleModal}) {

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
        <span id={styles.includeTitle}> Show: </span>
        {box.artists.length ?
          <div className={visibility.artists ? styles.includeButton : styles.includeButtonPressed} onClick={(e) => handleSectionVisibility(e)} handles="artists">
            <img className={styles.buttonIcon} alt="Toggle artists" src="/icons/artists.svg" />
          </div>
          : ""}
        {box.albums.length ?
          <div className={visibility.albums ? styles.includeButton : styles.includeButtonPressed} onClick={(e) => handleSectionVisibility(e)} handles="albums">
            <img className={styles.buttonIcon} alt="Toggle albums" src="/icons/albums.svg" />
          </div>
          : ""}
        {box.tracks.length ?
          <div className={visibility.tracks ? styles.includeButton : styles.includeButtonPressed} onClick={(e) => handleSectionVisibility(e)} handles="tracks">
            <img className={styles.buttonIcon} alt="Toggle songs" src="/icons/tracks.svg" />
          </div>
          : ""}
        {box.playlists.length ?
          <div className={visibility.playlists ? styles.includeButton : styles.includeButtonPressed} onClick={(e) => handleSectionVisibility(e)} handles="playlists">
            <img className={styles.buttonIcon} alt="Toggle playlists" src="/icons/playlists.svg" />
          </div>
          : ""}
      </div>
      <button id={styles.sortingButton} onClick={() => toggleModal({visible: true, type: "Sorting Options", boxId: box.id})}> Sorting Options </button>
    </div>
  )
}

export default BoxUtilities;
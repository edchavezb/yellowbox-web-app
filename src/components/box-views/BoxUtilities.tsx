//import React, { useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from "react";
import { ModalState, UserBox, Visibility } from "../../core/types/interfaces";

import styles from "./BoxUtilities.module.css";

interface IProps {
	box: UserBox
  singleTypeBox: Boolean
  visibility: Visibility
	setVisibility: Dispatch<SetStateAction<Visibility>>
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function BoxUtilities({box, singleTypeBox, visibility, setVisibility, toggleModal}: IProps) {

  const handleSectionVisibility = (e: React.MouseEvent<HTMLDivElement>) => {
    const section = e.currentTarget.getAttribute("data-handles")
    let newVisibility: {[key: string]: boolean} = {}
    if (visibility[section as keyof Visibility]){
      newVisibility[section as keyof typeof newVisibility] = false
    }
    else 
      newVisibility[section as keyof typeof newVisibility] = true
    setVisibility((state: Visibility) => ({...state, ...newVisibility}))
  }

  return (
    <div id={styles.boxUtilities}>
      <div id={singleTypeBox ? styles.noInclude : styles.includeToggler}>
        <span id={styles.includeTitle}> Show: </span>
        {box.artists.length ?
          <div className={visibility.artists ? styles.includeButton : styles.includeButtonPressed} onClick={(e) => handleSectionVisibility(e)} data-handles="artists">
            <img className={styles.buttonIcon} alt="Toggle artists" src="/icons/artists.svg" />
          </div>
          : ""}
        {box.albums.length ?
          <div className={visibility.albums ? styles.includeButton : styles.includeButtonPressed} onClick={(e) => handleSectionVisibility(e)} data-handles="albums">
            <img className={styles.buttonIcon} alt="Toggle albums" src="/icons/albums.svg" />
          </div>
          : ""}
        {box.tracks.length ?
          <div className={visibility.tracks ? styles.includeButton : styles.includeButtonPressed} onClick={(e) => handleSectionVisibility(e)} data-handles="tracks">
            <img className={styles.buttonIcon} alt="Toggle songs" src="/icons/tracks.svg" />
          </div>
          : ""}
        {box.playlists.length ?
          <div className={visibility.playlists ? styles.includeButton : styles.includeButtonPressed} onClick={(e) => handleSectionVisibility(e)} data-handles="playlists">
            <img className={styles.buttonIcon} alt="Toggle playlists" src="/icons/playlists.svg" />
          </div>
          : ""}
      </div>
      <button id={styles.sortingButton} onClick={() => toggleModal({visible: true, type: "Sorting Options", boxId: box._id, page:"Box"})}> Sorting Options </button>
    </div>
  )
}

export default BoxUtilities;
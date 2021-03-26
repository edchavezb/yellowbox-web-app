import React, { useState, useEffect } from 'react';

import SearchItem from "./SearchItem"
import styles from "./BoxSection.module.css";

function BoxSection(props) {

  let sectionIconSrc = ""

  switch (props.type) {
    case "Artists":
      sectionIconSrc = "/icons/artist.svg"
      break;
    case "Albums":
      sectionIconSrc = "/icons/album.svg"
      break;
    case "Tracks":
      sectionIconSrc = "/icons/song.svg"
      break;
  }

  return (
    <div className={styles.sectionPanel}>
      <div className={styles.sectionUtilities}>
        <img className={styles.sectionIcon} src={sectionIconSrc}></img>
        <span> {props.type} ({props.data.length}) </span>
      </div>
      <div className={styles.itemContainer}>
        {props.data.map((e) => {
          return <SearchItem key={e.id} element={e} />
        })}
      </div>
    </div>
  )
}

export default BoxSection;
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import styles from "./DetailItem.module.css";

function DetailItem(props) {
  const elementImages = props.element.type === "track" ? props.element.album.images : props.element.images;
  const artistName = props.element.type === "playlist" || props.element.type === "artist" ? ""
    : <Link to={`/detail/artist/${props.element.artists[0].id}`}><div className={styles.artistName}> {props.element.artists[0].name} </div> </Link>;
  const ownerName = props.element.type === "playlist" ? <a href={props.element.owner.uri}><div className={styles.artistName}> {props.element.owner.display_name} </div></a> : "";
  const itemCoverArt = elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"

  const handleDrag = (e, data) => {
    console.log(data)
    e.dataTransfer.setData("data", JSON.stringify(data))
    props.setElementDragging(true)
  }

  const handleDragEnd = () => {
    props.setElementDragging(false)
  }

  return (
    <div draggable onDragStart={(e) => handleDrag(e, props.element)} onDragEnd={() => handleDragEnd()} className={styles.itemRow}>

      <div className={styles.colLeftAlgn}>{props.index + 1}</div>

      <div className={styles.imageContainer}>
        <a href={`${props.element.uri}:play`}>
          <div className={styles.instantPlay}>
            <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
            {props.element.type === "track" ? <span> Play </span> : <span> Open </span>}
          </div>
        </a>
        <img draggable="false" className={styles.itemImage} alt={props.element.name} src={itemCoverArt}></img>
      </div>

      <div className={styles.dataCol}>
        <div className={props.element.type === "track" || props.element.type === "album"? styles.itemNameItalic : styles.itemName}> 
          <Link to={`/detail/${props.element.type}/${props.element.id}`}> {props.element.name} </Link>
        </div>
        <div className={styles.artist}> {props.element.type !== "playlist" ?
          artistName :
          ownerName}
        </div>
        

          {props.element.type === "album" ?
            <div className={styles.metaDataContainer}>
              <div className={styles.metaDataPill}>
                {`${props.element.album_type.charAt(0).toUpperCase()}${props.element.album_type.slice(1)}`}
              </div>
              <div className={styles.metaDataPill}>
                <span> {props.element.release_date.split("-")[0]} </span>
              </div>
              <div className={styles.metaDataPill}>
                <span> {props.element.total_tracks} tracks </span>
              </div>
            </div>
            : ""
          }

          {props.element.type === "playlist" ?
            <div className={styles.metaDataContainer}>
              <div className={styles.metaDataPill}>
                <span> {props.element.description} </span>
              </div>
              <div className={styles.metaDataPill}>
                <span> {props.element.tracks.total} tracks </span>
              </div>  
            </div>
            : ""
          } 
        
      </div>

      <div className={styles.notesCol}>
        <div className={styles.notesPanel}>
          <div className={styles.notesTitle}> NOTES </div>
          <div className={styles.notesDisplay}></div>
        </div>
      </div>

    </div>
  )
}

export default DetailItem;
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import styles from "./DetailRowAlbum.module.css";

function DetailRowAlbum(props) {
	const elementImages = props.element.type === "track" ? props.element.album.images : props.element.images;
	const artistName = props.element.type === "playlist" || props.element.type === "artist" ? ""
		: <Link to={`/detail/artist/${props.element.artists[0].id}`}><div className={styles.artistName}> {props.element.artists[0].name} </div> </Link>;
	const ownerName = props.element.type === "playlist" ? <Link to={props.element.owner.uri}><div className={styles.artistName}> {props.element.owner.display_name} </div></Link> : "";
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

			<div className={styles.colLeftAlgn}>{props.index+1}</div>

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
				  <div className={styles.name}> <Link to={`/detail/${props.element.type}/${props.element.id}`}> {props.element.name} </Link></div> 
          <div className={styles.artist}> {props.element.type !== "playlist" ?
					  artistName :
					  ownerName} 
          </div>
          <div className={styles.metaDataContainer}>
            <div class={styles.metaDataPill}>
              <span> Type: {`${props.element.album_type.charAt(0).toUpperCase()}${props.element.album_type.slice(1)}`} </span>
            </div>
            <div class={styles.metaDataPill}>
              <span> Release date: {props.element.release_date.split("-")[0]} </span>
            </div>
          </div>				 
			</div>

      <div className={styles.notesCol}>
        <div className={styles.notesPanel}>
          <div className={styles.notesTitle}> NOTES </div>
        </div>
      </div>

		</div>
	)
}

export default DetailRowAlbum;
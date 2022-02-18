import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import styles from "./DetailRowTrack.module.css";

function DetailRowTrack(props) {
	const artistName = props.element.type === "playlist" || props.element.type === "artist" ? ""
		: <Link to={`/detail/artist/${props.element.artists[0].id}`}><div className={styles.artistName}> {props.element.artists[0].name} </div> </Link>;
	const ownerName = props.element.type === "playlist" ? <Link to={props.element.owner.uri}><div className={styles.artistName}> {props.element.owner.display_name} </div></Link> : "";

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

			<div className={styles.colLeftAlgn}>
				 <div className={styles.name}> <Link to={`/detail/${props.element.type}/${props.element.id}`}> {props.element.name} </Link></div> 
			</div>

			<div className={styles.colLeftAlgn}>
				{props.element.type !== "playlist" ?
					artistName :
					ownerName}
			</div>

			<div className={styles.colLeftAlgn}>
				{props.element.album.name}
			</div>

			<div className={styles.colCentered}>
				{`${parseInt(props.element.duration_ms/60000)}`.padStart(2,0)+":"+`${Math.floor(props.element.duration_ms%60000/1000)}`.padStart(2,0)}
			</div>

			<div className={styles.colCentered}>
				{props.element.explicit ? "Explicit" : "Clean"}
			</div>

			<div className={styles.colCentered}>
				<a href={`${props.element.uri}:play`}>
					<div className={styles.instantPlay}>
						<img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
						{props.element.type === "track" ? <span> Play </span> : <span> Open </span>}
					</div>
				</a>
			</div>

		</div>
	)
}

export default DetailRowTrack;
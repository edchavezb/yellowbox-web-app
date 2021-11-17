import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import styles from "./ListItem.module.css";

function ListItem(props) {
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

			<div className={styles.playColumn}>
				<a href={`${props.element.uri}:play`}>
					<div className={styles.instantPlay}>
						<img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
						{props.element.type === "track" ? <span> Play </span> : <span> Open </span>}
					</div>
				</a>
			</div>

			<div className={styles.nameColumn}>
				<Link to={`/detail/${props.element.type}/${props.element.id}`}> <div className={styles.name}> {props.element.name} </div> </Link>
			</div>

			<div className={styles.artistOwnerColumn}>
				{props.element.type !== "playlist" ?
					artistName :
					ownerName}
			</div>

			<div className={styles.releaseUpdatedColumn}>
				{props.element.release_date}
			</div>

		</div>
	)
}

export default ListItem;
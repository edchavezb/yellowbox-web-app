import { Link } from "react-router-dom";

import styles from "./GridItem.module.css";

function GridItem({element, setElementDragging}) {
	const {name, type, album, images, artists, owner, uri, id} = element;
	const elementImages = type === "track" ? album.images : images;
	const itemCoverArt = elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"
	const artistName = type === "playlist" || type === "artist" ? ""
		: <Link to={`/detail/artist/${artists[0].id}`}><div className={styles.artistName}> {artists[0].name} </div> </Link>;
	const ownerName = type === "playlist" ? <a href={owner.uri}><div className={styles.artistName}> {owner.display_name} </div></a> : "";

	const handleDrag = (e, data) => {
		console.log(data)
		e.dataTransfer.setData("data", JSON.stringify(data))
		setElementDragging(true)
	}

	const handleDragEnd = () => {
		setElementDragging(false)
	}

	return (
		<div draggable onDragStart={(e) => handleDrag(e, element)} onDragEnd={() => handleDragEnd()} className={styles.itemCard}>
			<div className={styles.imageContainer}>
				<a href={`${uri}:play`}>
					<div className={styles.instantPlay}>
						<img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
						{type === "track" ? <span> Play </span> : <span> Open </span>}
					</div>
				</a>
				<img draggable="false" className={styles.itemImage} alt={name} src={itemCoverArt}></img>
			</div>
			<Link to={`/detail/${type}/${id}`}> <div className={styles.name}> {name} </div> </Link>
			{type !== "playlist" ?
				artistName :
				ownerName}
		</div>
	)
}

export default GridItem;
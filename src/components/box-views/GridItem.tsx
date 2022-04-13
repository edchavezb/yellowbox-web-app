import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Artist, Album, Track, Playlist, ItemImage } from "../../interfaces";
import  * as checkType from  "../../typeguards";

import styles from "./GridItem.module.css";

interface IProps<T> {
	element: T
	setElementDragging: (dragging: boolean) => void
}

function GridItem<T extends Artist | Album | Track | Playlist>({element, setElementDragging}: IProps<T>) {

	const {name, type, uri, id} = element;
  //Telling compiler not to expect null or undefined since value is assiged for all cases (! operator)
  let elementImages!: ItemImage[]; 
  let authorName!: ReactElement | string;

	if (checkType.isAlbum(element)){
		const {images, artists} = element;
    authorName = <Link to={`/detail/artist/${artists[0].id}`}><div className={styles.artistName}> {artists[0].name} </div> </Link>
    elementImages = images
	} 
  else if (checkType.isArtist(element)){
    const {images} = element
    authorName = ""
    elementImages = images
  }
  else if (checkType.isTrack(element)){
    const {artists, album} = element
    authorName = <Link to={`/detail/artist/${artists[0].id}`}><div className={styles.artistName}> {artists[0].name} </div> </Link>
    elementImages = album.images;
  }
	else if (checkType.isPlaylist(element)){
		const {images, owner} = element;
    authorName = <a href={owner.uri}><div className={styles.artistName}> {owner.display_name} </div></a>;
    elementImages = images
	}
	
	const itemCoverArt = elementImages && elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"


	const handleDrag = (e: React.DragEvent<HTMLDivElement>, element:IProps<T>["element"]) => {
		console.log(element)
		e.dataTransfer.setData("data", JSON.stringify(element))
		setElementDragging(true)
	}

	const handleDragEnd = () => {
		setElementDragging(false)
	}

	return (
		<div draggable onDragStart={(event) => handleDrag(event, element)} onDragEnd={() => handleDragEnd()} className={styles.itemCard}>
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
			{authorName}
		</div>
	)
}

export default GridItem;
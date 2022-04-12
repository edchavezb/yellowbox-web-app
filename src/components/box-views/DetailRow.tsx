import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Artist, Album, Track, Playlist, ItemImage } from "../../interfaces";
import  * as checkType from  "../../typeguards";

import styles from "./DetailRow.module.css";

interface IProps<T> {
	element: T
  index: number
	setElementDragging: (dragging: boolean) => void
}

function DetailRow<T extends Artist | Album | Track | Playlist>({element, setElementDragging, index}: IProps<T>) {
  const {name, type, uri, id} = element;
  
  //Telling compiler not to expect null or undefined since value is assiged for all cases (! operator)
  let elementImages!: ItemImage[]; 
  let authorName!: ReactElement | JSX.Element[] | string;
  let metadata!: JSX.Element | string;

  const getArtistLinks = (artistArr: Artist[]) => {
    const artistArray = artistArr.slice(0, 3).map((artist, idx, arr) => {
      return <Link to={`/detail/artist/${artist.id}`} key={idx}><span className={styles.artistName}> {`${artist.name}${arr[idx+1] ? ", " : ""}`} </span> </Link>;
    })
    return artistArray;
  }

  if (checkType.isAlbum(element)){
		const {images, artists, album_type, release_date, total_tracks} = element;
    authorName = getArtistLinks(artists)
    elementImages = images

    metadata = 
    <div className={styles.metaDataContainer}>
      <div className={styles.metaDataPill}>
        {`${album_type.charAt(0).toUpperCase()}${album_type.slice(1)}`}
      </div>
      <div className={styles.metaDataPill}>
        {`${release_date.split("-")[0]}`}
      </div>
      <div className={styles.metaDataPill}>
        {`${total_tracks} tracks`}
      </div>
    </div>
	} 

  else if (checkType.isArtist(element)){
    const {images, genres} = element
    authorName = ""
    elementImages = images

    metadata = genres ?
    <div className={styles.metaDataContainer}>
      {genres.slice(0,3).map(e => {
        return (
        <div className={styles.metaDataPill} key={e}>
            {e.split(" ").map(word => {
              return `${word.charAt(0).toUpperCase()}${word.slice(1)} `
            })}
        </div> )
      })}
    </div>
    : ""
  }

  else if (checkType.isTrack(element)){
    const {artists, album, duration_ms} = element
    authorName = getArtistLinks(artists)
    elementImages = album.images;

    metadata = 
    <div className={styles.metaDataContainer}>
      <div className={styles.metaDataPill}>
        {`${album.release_date.split("-")[0]}`}
      </div>
      <div className={styles.metaDataPill}>
        {`${duration_ms/60000}`.padStart(2,'0')+":"+`${Math.floor(duration_ms%60000/1000)}`.padStart(2,'0')}
      </div>
    </div>
  }

	else if (checkType.isPlaylist(element)){
		const {images, owner, description, tracks} = element;
    authorName = <a href={owner.uri}><div className={styles.artistName}> {owner.display_name} </div></a>;
    elementImages = images

    metadata = 
    <div className={styles.metaDataContainer}>
      <div className={styles.metaDataPill}>
      {`${description}`}
      </div>
      <div className={styles.metaDataPill}>
        {`${tracks.total} tracks`}
      </div>  
    </div>
	}

  const itemCoverArt = elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>, element:IProps<T>["element"]) => {
    e.dataTransfer.setData("data", JSON.stringify(element))
    setElementDragging(true)
  }

  const handleDragEnd = () => {
    setElementDragging(false)
  }

  return (
    <div draggable onDragStart={(e) => handleDrag(e, element)} onDragEnd={() => handleDragEnd()} className={styles.itemRow}>

      <div className={styles.colLeftAlgn}>{index + 1}</div>

      <div className={styles.imageContainer}>
        <a href={`${uri}:play`}>
          <div className={styles.instantPlay}>
            <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
            {type === "track" ? <span> Play </span> : <span> Open </span>}
          </div>
        </a>
        <img draggable="false" className={styles.itemImage} alt={name} src={itemCoverArt}></img>
      </div>

      <div className={styles.dataCol}>
        <div className={type === "track" || type === "album"? styles.itemNameItalic : styles.itemName}> 
          <Link to={`/detail/${type}/${id}`}> {name} </Link>
        </div>

        {type !== "artist" ?
          <div className={styles.artist}> 
            {authorName}
          </div>
          : ""
        }
        
        {metadata}
        
      </div>

      <div className={styles.notesCol}>
        <div className={styles.notesPanel}>
          <div className={styles.notesTitle}> NOTES </div>
          <div className={styles.notesDisplay}></div>
          <div className={styles.notesOverlay}> 
            <div className={styles.overlayTitle}> EXPAND ⛶ </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DetailRow;
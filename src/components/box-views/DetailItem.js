import { Link } from "react-router-dom";

import styles from "./DetailItem.module.css";

function DetailItem({element, setElementDragging, index}) {
  const {name, type, album, artists, genres, images, owner, album_type, release_date, total_tracks, duration_ms, description, tracks, uri, id} = element

  const elementImages = type === "track" ? album.images : images;
  const itemCoverArt = elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"

  const ownerName = type === "playlist" && <a href={owner.uri}><div className={styles.artistName}> {owner.display_name} </div></a>;

  const getArtists = () => {
    const artistArray = artists.slice(0, 3).map((artist, idx, arr) => {
      return <Link to={`/detail/artist/${artist.id}`}><span className={styles.artistName}> {`${artist.name}${arr[idx+1] ? ", " : ""}`} </span> </Link>;
    })

    return artistArray;
  }

  
  const handleDrag = (e, data) => {
    console.log(data)
    e.dataTransfer.setData("data", JSON.stringify(data))
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
        <div className={styles.artist}> {type !== "playlist" ?
          getArtists() :
          ownerName}
        </div>
        
        {type === "artist" && genres ?
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

        {type === "album" ?
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
          : ""
        }

        {type === "track" ?
          <div className={styles.metaDataContainer}>
            <div className={styles.metaDataPill}>
              {`${album.release_date.split("-")[0]}`}
            </div>
            <div className={styles.metaDataPill}>
              {`${parseInt(duration_ms/60000)}`.padStart(2,0)+":"+`${Math.floor(duration_ms%60000/1000)}`.padStart(2,0)}
            </div>
          </div>
          : ""
        }

        {type === "playlist" ?
          <div className={styles.metaDataContainer}>
            <div className={styles.metaDataPill}>
            {`${description}`}
            </div>
            <div className={styles.metaDataPill}>
              {`${tracks.total} tracks`}
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
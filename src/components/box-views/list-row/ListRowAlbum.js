import { Link } from "react-router-dom";

import styles from "./ListRowAlbum.module.css";

function ListRowAlbum({ element, setElementDragging, index }) {
  const { name, type, artists, album_type, release_date, id, uri } = element;

  const getArtists = () => {
    const artistArray = artists.slice(0, 3).map((artist, index, arr) => {
      return <Link to={`/detail/artist/${artist.id}`}><span className={styles.artistName}> {`${artist.name}${arr[index+1] ? ", " : ""}`} </span> </Link>;
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
    <div draggable onDragStart={(event) => handleDrag(event, element)} onDragEnd={() => handleDragEnd()} className={styles.itemRow}>

      <div className={styles.colLeftAlgn}>{index + 1}</div>

      <div className={styles.colLeftAlgn}>
        <div className={styles.name}> <Link to={`/detail/${type}/${id}`}> {name} </Link></div>
      </div>

      <div className={styles.colLeftAlgn}>
        {getArtists()}
      </div>

      <div className={styles.colCentered}>
        {`${album_type.charAt(0).toUpperCase()}${album_type.slice(1)}`}
      </div>

      <div className={styles.colCentered}>
        {release_date.split("-")[0]}
      </div>

      <div className={styles.colCentered}>
        <a href={`${uri}:play`}>
          <div className={styles.instantPlay}>
            <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
            {type === "track" ? <span> Play </span> : <span> Open </span>}
          </div>
        </a>
      </div>

    </div>
  )
}

export default ListRowAlbum;
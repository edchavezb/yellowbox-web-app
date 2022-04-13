import { Link } from "react-router-dom";
import { Track } from "../../../interfaces";

import styles from "./ListRowTrack.module.css";

interface IProps {
	element: Track
  index: number
  page: string
	setElementDragging: (dragging: boolean) => void
}

function ListRowTrack({ element, setElementDragging, index, page }: IProps) {

  const { name, type, artists, album, duration_ms, explicit, id, uri } = element;

  const getArtistLinks = () => {
    const artistArray = artists.slice(0, 3).map((artist, idx, arr) => {
      return <Link to={`/detail/artist/${artist.id}`} key={idx}><span className={styles.artistName}> {`${artist.name}${arr[idx + 1] ? ", " : ""}`} </span> </Link>;
    })

    return artistArray;
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, element:IProps["element"]) => {
    console.log(element)
    e.dataTransfer.setData("data", JSON.stringify(element))
    setElementDragging(true)
  }

  const handleDragEnd = () => {
    setElementDragging(false)
  }

  return (
    <div draggable onDragStart={(e) => handleDrag(e, element)} onDragEnd={() => handleDragEnd()} className={styles.itemRow}>

      <div className={styles.colLeftAlgn}>{index + 1}</div>

      <div className={styles.colLeftAlgn}>
        <div className={styles.name}> <Link to={`/detail/${type}/${id}`}> <span className={styles.name}> {name} </span> </Link></div>
      </div>

      <div className={styles.colLeftAlgn}>
        {getArtistLinks()}
      </div>

      <div className={styles.colLeftAlgn}>
        <Link to={`/detail/album/${album.id}`}>{album.name}</Link>
      </div>

      <div className={styles.colCentered}>
        {`${Math.floor(duration_ms/60000)}`.padStart(2, '0') + ":" + `${Math.floor(duration_ms % 60000 / 1000)}`.padStart(2, '0')}
      </div>

      <div className={styles.colCentered}>
        {explicit ? "Explicit" : "Clean"}
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

export default ListRowTrack;
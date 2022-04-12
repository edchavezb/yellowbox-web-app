import { Link } from "react-router-dom";
import { Playlist } from "../../../interfaces";

import styles from "./ListRowPlaylist.module.css";

interface IProps {
	element: Playlist
  index: number
  page: string
	setElementDragging: (dragging: boolean) => void
}

function ListRowPlaylist({element, setElementDragging, index, page}: IProps) {

  const {name, type, id, description, tracks, owner, uri} = element;

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, element:IProps["element"]) => {
    console.log(element)
    e.dataTransfer.setData("data", JSON.stringify(element))
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
        {description}
      </div>

      <div className={styles.colLeftAlgn}>
        {tracks.total}
      </div>

      <div className={styles.colLeftAlgn}>
        <Link to={owner.uri}><div className={styles.artistName}> {owner.display_name} </div></Link>
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

export default ListRowPlaylist;
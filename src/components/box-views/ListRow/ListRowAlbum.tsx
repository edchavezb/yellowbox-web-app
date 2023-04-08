import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Album } from "core/types/interfaces";

import styles from "./ListRowAlbum.module.css";

interface IProps {
  element: Album
  index: number
  page: string
  setElementDragging: (dragging: boolean) => void
  reorderingMode: boolean
}

function ListRowAlbum({ element, setElementDragging, index, page, reorderingMode }: IProps) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: element._id! })
  const albumRowRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { name, type, artists, album_type, release_date, id, uri } = element;
  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
  }

  const getArtistLinks = () => {
    const artistArray = artists.slice(0, 3).map((artist, idx, arr) => {
      return <Link to={`/detail/artist/${artist.id}`} key={idx}><span className={styles.artistName}> {`${artist.name}${arr[idx + 1] ? ", " : ""}`} </span> </Link>;
    })

    return artistArray;
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, element: IProps["element"]) => {
    e.dataTransfer.setData("data", JSON.stringify(element))
    setElementDragging(true)
  }

  const handleDragEnd = () => {
    setElementDragging(false)
  }

  return (
    reorderingMode ?
      <div
        className={styles.itemRow}
        ref={setNodeRef}
        style={draggableStyle}
        {...listeners}
        {...attributes}
      >
        <div className={styles.dragHandle}>
          <img className={styles.reorderIcon} src="/icons/reorder.svg" alt="reorder"></img>
        </div>
        <div className={styles.colLeftAlgn}>
          <div className={styles.name}> <Link to={`/detail/${type}/${id}`}> {name} </Link></div>
        </div>
        <div className={styles.colLeftAlgn}>
          {getArtistLinks()}
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
      :
      <>
        <div draggable onDragStart={(event) => handleDrag(event, element)} onDragEnd={() => handleDragEnd()} className={styles.itemRow}>
          <div className={styles.colLeftAlgn}>{index + 1}</div>
          <div className={styles.colLeftAlgn}>
            <div className={styles.name}> <Link to={`/detail/${type}/${id}`}> {name} </Link></div>
          </div>
          <div className={styles.colLeftAlgn}>
            {getArtistLinks()}
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
          <div className={styles.itemMenu} ref={albumRowRef} onClick={() => setIsMenuOpen(true)}>
            <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
          </div>
        </div>
        <PopperMenu referenceRef={albumRowRef} placement={'left'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu itemData={element} setIsOpen={setIsMenuOpen} itemType={element.type} />
        </PopperMenu>
      </>
  )
}

export default ListRowAlbum;
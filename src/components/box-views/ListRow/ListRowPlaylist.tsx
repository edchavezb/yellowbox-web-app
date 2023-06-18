import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Playlist } from "core/types/interfaces";

import styles from "./ListRowPlaylist.module.css";

interface IProps {
  element: Playlist
  index: number
  setElementDragging: (dragging: boolean) => void
  reorderingMode: boolean
  subId?: string
}

function ListRowPlaylist({ element, setElementDragging, index, reorderingMode, subId }: IProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element._id! })
  const playlistRowRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { name, type, id, description, tracks, owner, uri } = element;
  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
    transition
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
        ref={setNodeRef}
        className={styles.itemRow}
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
      :
      <>
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
            <Link to={owner.uri}><div className={styles.ownerName}> {owner.display_name} </div></Link>
          </div>
          <div className={styles.colCentered}>
            <a href={`${uri}:play`}>
              <div className={styles.instantPlay}>
                <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
                {type === "track" ? <span> Play </span> : <span> Open </span>}
              </div>
            </a>
          </div>
          <div className={styles.itemMenu} ref={playlistRowRef} onClick={() => setIsMenuOpen(true)}>
            <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
          </div>
        </div>
        <PopperMenu referenceRef={playlistRowRef} placement={'left'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu itemData={element} setIsOpen={setIsMenuOpen} itemType={element.type} subId={subId}/>
        </PopperMenu>
      </>
  )
}

export default ListRowPlaylist;
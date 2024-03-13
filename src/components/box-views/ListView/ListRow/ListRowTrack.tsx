import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Track } from "../../../../core/types/interfaces";
import styles from "./ListRowTrack.module.css";

interface IProps {
  element: Track
  dbIndex?: number
  index: number
  offset?: number
  setElementDragging: (dragging: boolean) => void
  reorderingMode: boolean
  subId?: string
}

function ListRowTrack({ element, setElementDragging, dbIndex, index, offset = 0, reorderingMode, subId }: IProps) {
  console.log(element)
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element._id!, data: { index: dbIndex || index } })
  const trackRowRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { name, type, artists, album, duration_ms, explicit, id, uri } = element;
  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const getArtistLinks = () => {
    const artistArray = artists?.slice(0, 3).map((artist, idx, arr) => {
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

  if (reorderingMode) {
    return (
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
          <div className={styles.nameArtistCol}>
            <div className={styles.imgWrapper}>
              <img src={element.album!.images[2].url} alt={element.name} className={styles.itemImage}></img>
            </div>
            <div className={styles.flexColumn}>
              <div className={styles.name}>
                <Link to={`/detail/${type}/${id}`}>
                  <span className={styles.nameText}>{name}</span>
                </Link>
              </div>
              <div className={styles.smallText}>
                {getArtistLinks()}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.colLeftAlgn} ${styles.mobileHidden} ${styles.smallText}`}>
          <Link to={`/detail/album/${album!.id}`}><span className={styles.albumName}> {album!.name} </span></Link>
        </div>
        <div className={`${styles.colCentered} ${styles.mobileHidden} ${styles.smallText}`}>
          {`${Math.floor(duration_ms / 60000)}`.padStart(2, '0') + ":" + `${Math.floor(duration_ms % 60000 / 1000)}`.padStart(2, '0')}
        </div>
        <div className={`${styles.colCentered} ${styles.mobileHidden} ${styles.smallText}`}>
          {explicit ? "Explicit" : "Clean"}
        </div>
        <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
          <a href={uri}>
            <div className={styles.instantPlay}>
              <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
              {type === "track" ? <span> Play </span> : <span> Open </span>}
            </div>
          </a>
        </div>
      </div>
    )
  }

  else {
    return (
      <>
        <div draggable
          onDragStart={(e) => handleDrag(e, element)}
          onDragEnd={() => handleDragEnd()}
          className={styles.itemRow}
        >
          <div className={styles.colLeftAlgn}>{index + offset + 1}</div>
          <div className={styles.colLeftAlgn}>
            <div className={styles.nameArtistCol}>
              <div className={styles.imgWrapper}>
                <img src={element.album!.images[2].url} alt={element.name} className={styles.itemImage}></img>
              </div>
              <div className={styles.flexColumn}>
                <div className={styles.name}>
                  <Link to={`/detail/${type}/${id}`}>
                    <span className={styles.nameText}>{name}</span>
                  </Link>
                </div>
                <div className={styles.smallText}>
                  {getArtistLinks()}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colLeftAlgn} ${styles.mobileHidden} ${styles.smallText}`}>
            {
              album ?
                <Link to={`/detail/album/${album!.id}`}><span className={styles.albumName}> {album!.name} </span></Link>
                :
                <span className={styles.albumName}> Not found </span>
            }
          </div>
          <div className={`${styles.colCentered} ${styles.mobileHidden} ${styles.smallText}`}>
            {`${Math.floor(duration_ms / 60000)}`.padStart(2, '0') + ":" + `${Math.floor(duration_ms % 60000 / 1000)}`.padStart(2, '0')}
          </div>
          <div className={`${styles.colCentered} ${styles.mobileHidden} ${styles.smallText}`}>
            {explicit ? "Explicit" : "Clean"}
          </div>
          <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
            <a href={uri}>
              <div className={styles.instantPlay}>
                <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
                {type === "track" ? <span> Play </span> : <span> Open </span>}
              </div>
            </a>
          </div>
          <div className={styles.itemMenu} ref={trackRowRef} onClick={() => setIsMenuOpen(true)}>
            <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
          </div>
        </div >
        <PopperMenu referenceRef={trackRowRef} placement={'left'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu itemData={element} itemIndex={dbIndex || index} setIsOpen={setIsMenuOpen} itemType={element.type} subId={subId} />
        </PopperMenu>
      </>
    )
  }
}

export default ListRowTrack;
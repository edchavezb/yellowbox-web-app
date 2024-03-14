import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Playlist } from "core/types/interfaces";
import styles from "./ListRowPlaylist.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";
import { extractCrucialData, getElementImage } from "core/helpers/itemDataHandlers";
import { updateBoxPlaylistApi } from "core/api/userboxes/playlists";

interface IProps {
  element: Playlist
  dbIndex?: number
  index: number
  offset?: number
  setElementDragging: (dragging: boolean) => void
  reorderingMode: boolean
  subId?: string
}

function ListRowPlaylist({ element, setElementDragging, dbIndex, index, offset = 0, reorderingMode, subId }: IProps) {
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const spotifyLoginData = useAppSelector(state => state.spotifyLoginData);
  const spotifyToken = spotifyLoginData?.genericToken;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element._id!, data: { index: dbIndex || index } })
  const playlistRowRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [elementImage, setElementImage] = useState(getElementImage(element));
  const { name, type, id, description, tracks, owner, uri } = element;
  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const queryItemIdApi = async (type: string, id: string, token: string) => {
    const response = await fetch(`https://api.spotify.com/v1/${type}s/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      }
    })
    const item = await response.json();
    return item;
  }

  const handleImageError = async () => {
    const itemResponse = await queryItemIdApi(element.type, element.id, spotifyToken!);
    const itemImage = getElementImage(itemResponse);
    setElementImage(itemImage);
    const itemData = extractCrucialData(itemResponse);
    itemData._id = element._id
    updateBoxPlaylistApi(currentBox._id, itemData._id!, itemData as Playlist)
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
          <div className={styles.nameArtistCol}>
            <div className={styles.imgWrapper}>
              <img
                draggable="false"
                className={styles.itemImage}
                alt={name}
                src={elementImage}
                onError={handleImageError}
              />
            </div>
            <div className={styles.flexColumn}>
              <div className={styles.name}>
                <Link to={`/detail/${type}/${id}`}>
                  <span className={styles.nameText}>{name}</span>
                </Link>
              </div>
              <div className={styles.smallText}>
                {description}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.colCentered} ${styles.smallText}`}>
          {tracks.total}
        </div>
        <div className={`${styles.colLeftAlgn} ${styles.mobileHidden} ${styles.smallText}`}>
          <Link to={owner.uri}><div className={styles.ownerName}> {owner.display_name} </div></Link>
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
        <div draggable onDragStart={(event) => handleDrag(event, element)} onDragEnd={() => handleDragEnd()} className={styles.itemRow}>
          <div className={styles.colLeftAlgn}>{index + offset + 1}</div>
          <div className={styles.colLeftAlgn}>
            <div className={styles.nameArtistCol}>
              <div className={styles.imgWrapper}>
                <img
                  draggable="false"
                  className={styles.itemImage}
                  alt={name}
                  src={elementImage}
                  onError={handleImageError}
                />
              </div>
              <div className={styles.flexColumn}>
                <div className={styles.name}>
                  <Link to={`/detail/${type}/${id}`}>
                    <span className={styles.nameText}>{name}</span>
                  </Link>
                </div>
                <div className={styles.smallText}>
                  {description}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colCentered} ${styles.smallText}`}>
            {tracks.total}
          </div>
          <div className={`${styles.colLeftAlgn} ${styles.mobileHidden} ${styles.smallText}`}>
            <Link to={owner.uri}><div className={styles.ownerName}> {owner.display_name} </div></Link>
          </div>
          <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
            <a href={uri}>
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
          <BoxItemMenu itemData={element} itemIndex={dbIndex || index} setIsOpen={setIsMenuOpen} itemType={element.type} subId={subId} />
        </PopperMenu>
      </>
    )
  }
}

export default ListRowPlaylist;
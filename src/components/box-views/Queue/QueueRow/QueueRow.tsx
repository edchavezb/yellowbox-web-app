import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { ReactElement, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { QueueItem } from "core/types/interfaces";
import styles from "./QueueRow.module.css";
import * as checkType from "core/helpers/typeguards";
import { getUri, extractApiData, getElementImage } from "core/helpers/itemDataHandlers";
import { updateAlbumImagesApi } from "core/api/userboxes/albums";
import { updateArtistImagesApi } from "core/api/userboxes/artists";
import { updatePlaylistImagesApi } from "core/api/userboxes/playlists";
import { updateTrackImagesApi } from "core/api/userboxes/tracks";
import { useAppSelector } from "core/hooks/useAppSelector";
import { ItemData } from "core/types/types";

interface IProps {
  element: QueueItem
  itemIndex: number
  setElementDragging: (dragging: boolean) => void
  reorderingMode: boolean
}

function QueueRow({ element, setElementDragging, itemIndex, reorderingMode }: IProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element.queueItemId!, data: { index: itemIndex } })
  const queueRowRef = useRef(null);
  const spotifyLoginData = useAppSelector(state => state.spotifyLoginData);
  const spotifyToken = spotifyLoginData?.genericToken;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemData, isPlayed, queueItemId } = element;
  const { name, type: itemType, spotifyId } = itemData;
  const [elementImage, setElementImage] = useState(getElementImage(itemData));
  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const authorNameLink = getElementAuthorLink(itemData);

  function getElementAuthorLink(item: ItemData) {
    let authorLink: ReactElement | string = '';

    if (checkType.isAlbum(item)) {
      const { artists } = item;
      authorLink = <Link to={`/detail/artist/${artists[0].spotifyId}`}><div className={styles.artistName}> {artists[0].name} </div> </Link>
    }
    else if (checkType.isArtist(item)) {
      authorLink = ""
    }
    else if (checkType.isTrack(item)) {
      const { artists } = item;
      authorLink = <Link to={`/detail/artist/${artists[0].spotifyId}`}><div className={styles.artistName}> {artists[0].name} </div> </Link>
    }
    else if (checkType.isPlaylist(item)) {
      const { ownerDisplayName, ownerId } = item;
      authorLink = <a href={getUri('user', ownerId)}><div className={styles.artistName}> {ownerDisplayName} </div></a>;
    }

    return authorLink;
  }

  const queryItemIdApi = async (type: string, spotifyId: string, token: string) => {
    const response = await fetch(`https://api.spotify.com/v1/${type}s/${spotifyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      }
    })
    const item = await response.json();
    return item;
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, element: IProps["element"]) => {
    e.dataTransfer.setData("data", JSON.stringify(element.itemData))
    setElementDragging(true)
  }

  const handleDragEnd = () => {
    setElementDragging(false)
  }

  const handleImageError = async () => {
    const itemResponse = await queryItemIdApi(itemType, spotifyId, spotifyToken!);
    if (!itemResponse.error) {
      const itemData = extractApiData(itemResponse);
      const itemImage = getElementImage(itemData);
      setElementImage(itemImage);
      updateItemImagesInDb(itemData);
    }
  }

  function updateItemImagesInDb(updatedElement: ItemData) {
    if (checkType.isAlbum(updatedElement)) {
      updateAlbumImagesApi(updatedElement.spotifyId, updatedElement.images)
    }
    else if (checkType.isArtist(updatedElement)) {
      updateArtistImagesApi(updatedElement.spotifyId, updatedElement.images!)
    }
    else if (checkType.isTrack(updatedElement)) {
      updateTrackImagesApi(updatedElement.spotifyId, updatedElement.albumImages)
    }
    else if (checkType.isPlaylist(updatedElement)) {
      updatePlaylistImagesApi(updatedElement.spotifyId, updatedElement.images)
    }
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
              <Link to={`/detail/${itemType}/${spotifyId}`}>
                <img
                  draggable="false"
                  className={styles.itemImage}
                  alt={name}
                  src={elementImage}
                  onError={handleImageError}
                />
              </Link>
            </div>
            <div className={styles.flexColumn}>
              <div className={styles.name}>
                <Link to={`/detail/${itemType}/${spotifyId}`}>
                  <span className={styles.nameText}>{name}</span>
                </Link>
              </div>
              <div className={styles.smallText}>
                {authorNameLink}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
          <div>
            {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </div>
        </div>
        <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
          <a href={`spotify:${itemType}:${spotifyId}`}>
            <div className={styles.instantPlay}>
              <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
              <span> Open </span>
            </div>
          </a>
        </div>
        <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
          <div>
            {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </div>
        </div>
      </div>
    )
  }

  else {
    return (
      <>
        <div draggable onDragStart={(event) => handleDrag(event, element)} onDragEnd={() => handleDragEnd()} className={styles.itemRow}>
          <div className={`${styles.colRightAlgn} ${styles.smallText} ${styles.indexCol}`}>{itemIndex + 1}</div>
          <div className={styles.colLeftAlgn}>
            <div className={styles.nameArtistCol}>
              <div className={styles.imgWrapper}>
                <Link to={`/detail/${itemType}/${spotifyId}`}>
                  <img
                    draggable="false"
                    className={styles.itemImage}
                    alt={name}
                    src={elementImage}
                    onError={handleImageError}
                  />
                </Link>
              </div>
              <div className={styles.flexColumn}>
                <div className={`${styles.name} ${styles.lineClamp}`}>
                  <Link to={`/detail/${itemType}/${spotifyId}`}>
                    <span className={styles.nameText}>{name}</span>
                  </Link>
                </div>
                <div className={`${styles.smallText} ${styles.lineClamp}`}>
                  {authorNameLink}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
            <div>
              {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
            </div>
          </div>
          <div className={`${styles.flexCentered} ${styles.mobileHidden}`}>
            <a href={`spotify:${itemType}:${spotifyId}`}>
              <div className={styles.instantPlay}>
                <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
                <span> Open </span>
              </div>
            </a>
          </div>
          <div className={`${styles.flexCentered} ${styles.mobileHidden}`}>
            <img className={styles.dotsIcon} src={`/icons/${isPlayed ? "checkcirclegreen" : "checkcirclegray"}.svg`} alt='menu' />
          </div>
          <div className={styles.itemMenu} ref={queueRowRef} onClick={() => setIsMenuOpen(true)}>
            <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
          </div>
        </div>
        <PopperMenu referenceRef={queueRowRef} placement={'right-start'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu itemData={itemData} itemIndex={itemIndex} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} itemType={itemType} queueItemId={queueItemId} />
        </PopperMenu>
      </>
    )
  }
}

export default QueueRow;
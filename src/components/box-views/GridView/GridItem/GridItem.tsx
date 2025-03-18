import { ReactElement, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Artist, Album, Track, Playlist } from "core/types/interfaces";
import * as checkType from "core/helpers/typeguards";
import styles from "./GridItem.module.css";
import PopperMenu from "components/menus/popper/PopperMenu";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useAppSelector } from "core/hooks/useAppSelector";
import { extractApiData, getElementImage, getUri } from "core/helpers/itemDataHandlers";
import { updateAlbumImagesApi } from "core/api/userboxes/albums";
import { updateArtistImagesApi } from "core/api/userboxes/artists";
import { updatePlaylistImagesApi } from "core/api/userboxes/playlists";
import { updateTrackImagesApi } from "core/api/userboxes/tracks";

interface IProps<T> {
  element: T
  itemIndex: number,
  setElementDragging: (dragging: boolean) => void
  reorderingMode?: boolean
  subId?: string
}

function GridItem<T extends Artist | Album | Track | Playlist>({ element, itemIndex, setElementDragging, reorderingMode, subId }: IProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element.boxItemId!, data: { index: itemIndex } })
  const gridItemRef = useRef(null);
  const spotifyLoginData = useAppSelector(state => state.spotifyLoginData);
  const spotifyToken = spotifyLoginData?.genericToken;
  const { name, type, spotifyId } = element;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [elementImage, setElementImage] = useState(getElementImage(element));
  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const authorNameLink = getElementAuthorLink(element);

  function getElementAuthorLink(item: T) {
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

  const handleDrag = (event: React.DragEvent<HTMLDivElement>, element: IProps<T>["element"]) => {
    event.dataTransfer.setData("data", JSON.stringify(element))
    setElementDragging(true)
  }

  const handleDragEnd = () => {
    setElementDragging(false)
  }

  const handleImageError = async () => {
    const itemResponse = await queryItemIdApi(element.type, element.spotifyId, spotifyToken!);
    if (!itemResponse.error) {
      const itemData = extractApiData(itemResponse);
      const itemImage = getElementImage(itemData as T);
      setElementImage(itemImage);
      updateItemImagesInDb(itemData as T);
    }
    else {
      console.log("Error fetching item data")
    }
  }

  function updateItemImagesInDb(updatedElement: T) {
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
        className={styles.itemCard}
        ref={setNodeRef}
        style={draggableStyle}
        {...listeners}
        {...attributes}
      >
        <div className={styles.imageContainerReorder} ref={gridItemRef}>
          <a href={getUri(type, spotifyId)}>
            <div className={styles.instantPlay}>
              <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify' />
              {type === "track" ? <span> Play </span> : <span> Open </span>}
            </div>
          </a>
          <img
            draggable="false"
            className={styles.itemImage}
            alt={name}
            src={elementImage}
            onError={handleImageError}
          />
        </div>
        <Link to={`/detail/${type}/${spotifyId}`}> <div className={styles.name}> {name} </div> </Link>
        {authorNameLink}
      </div>
    )
  }

  else {
    return (
      <>
        <div
          draggable
          onDragStart={(event) => handleDrag(event, element)}
          onDragEnd={() => handleDragEnd()}
          className={styles.itemCard}
        >
          <div className={styles.imageContainer} ref={gridItemRef}>
            <a href={getUri(type, spotifyId)}>
              <div className={styles.instantPlay}>
                <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify' />
                {type === "track" ? <span> Play </span> : <span> Open </span>}
              </div>
            </a>
            <div className={styles.itemMenu} onClick={() => setIsMenuOpen(true)}>
              <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
            </div>
            <Link to={`/detail/${type}/${spotifyId}`}>
              <img
                draggable="false"
                className={styles.itemImage}
                alt={name}
                src={elementImage}
                onError={handleImageError}
              />
            </Link>
          </div>
          <Link to={`/detail/${type}/${spotifyId}`}> <div className={styles.name}> {name} </div> </Link>
          {authorNameLink}
        </div >
        <PopperMenu referenceRef={gridItemRef} placement={'right-start'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu itemData={element} itemIndex={itemIndex} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} itemType={type} subId={subId} />
        </PopperMenu>
      </>
    )
  }
}

export default GridItem;
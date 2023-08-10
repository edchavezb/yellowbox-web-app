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
import { extractCrucialData, getElementImage } from "core/helpers/itemDataHandlers";
import { updateBoxAlbumApi } from "core/api/userboxes/albums";
import { updateBoxArtistApi } from "core/api/userboxes/artists";
import { updateBoxPlaylistApi } from "core/api/userboxes/playlists";
import { updateBoxTrackApi } from "core/api/userboxes/tracks";

interface IProps<T> {
  element: T
  itemIndex: number,
  setElementDragging: (dragging: boolean) => void
  reorderingMode?: boolean
  subId?: string
}

function GridItem<T extends Artist | Album | Track | Playlist>({ element, itemIndex, setElementDragging, reorderingMode, subId}: IProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element._id!, data: {index: itemIndex} })
  const gridItemRef = useRef(null);
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const spotifyLoginData = useAppSelector(state => state.spotifyLoginData);
  const spotifyToken = spotifyLoginData?.genericToken;
  const { name, type, uri, id } = element;
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
      authorLink = <Link to={`/detail/artist/${artists[0].id}`}><div className={styles.artistName}> {artists[0].name} </div> </Link>
    }
    else if (checkType.isArtist(item)) {
      authorLink = ""
    }
    else if (checkType.isTrack(item)) {
      const { artists } = item;
      authorLink = <Link to={`/detail/artist/${artists[0].id}`}><div className={styles.artistName}> {artists[0].name} </div> </Link>
    }
    else if (checkType.isPlaylist(item)) {
      const { owner } = item;
      authorLink = <a href={owner.uri}><div className={styles.artistName}> {owner.display_name} </div></a>;
    }
  
    return authorLink;
  }

  function updateItemInBox(updatedElement: T) {
    if (checkType.isAlbum(updatedElement)) {
      updateBoxAlbumApi(currentBox._id, updatedElement._id!, updatedElement)
    }
    else if (checkType.isArtist(updatedElement)) {
      updateBoxArtistApi(currentBox._id, updatedElement._id!, updatedElement)
    }
    else if (checkType.isTrack(updatedElement)) {
      updateBoxTrackApi(currentBox._id, updatedElement._id!, updatedElement)
    }
    else if (checkType.isPlaylist(updatedElement)) {
      updateBoxPlaylistApi(currentBox._id, updatedElement._id!, updatedElement)
    }
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

  const handleDrag = (event: React.DragEvent<HTMLDivElement>, element: IProps<T>["element"]) => {
    event.dataTransfer.setData("data", JSON.stringify(element))
    setElementDragging(true)
  }

  const handleDragEnd = () => {
    setElementDragging(false)
  }

  const handleImageError = async () => {
    const itemResponse = await queryItemIdApi(element.type, element.id, spotifyToken!);
    const itemImage = getElementImage(itemResponse);
    setElementImage(itemImage);
    const itemData = extractCrucialData(itemResponse);
    itemData._id = element._id
    updateItemInBox(itemData as T);
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
          <a href={uri}>
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
        <Link to={`/detail/${type}/${id}`}> <div className={styles.name}> {name} </div> </Link>
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
            <a href={uri}>
              <div className={styles.instantPlay}>
                <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify' />
                {type === "track" ? <span> Play </span> : <span> Open </span>}
              </div>
            </a>
            <div className={styles.itemMenu} onClick={() => setIsMenuOpen(true)}>
              <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
            </div>
            <Link to={`/detail/${type}/${id}`}>
              <img
                draggable="false"
                className={styles.itemImage}
                alt={name}
                src={elementImage}
                onError={handleImageError}
              />
            </Link>
          </div>
          <Link to={`/detail/${type}/${id}`}> <div className={styles.name}> {name} </div> </Link>
          {authorNameLink}
        </div >
        <PopperMenu referenceRef={gridItemRef} placement={'right-start'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu itemData={element} itemIndex={itemIndex} setIsOpen={setIsMenuOpen} itemType={type} subId={subId} />
        </PopperMenu>
      </>
    )
  }
}

export default GridItem;
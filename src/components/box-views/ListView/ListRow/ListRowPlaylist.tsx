import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Playlist } from "core/types/interfaces";
import styles from "./ListRowPlaylist.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";
import { extractApiData, getElementImage, getUri } from "core/helpers/itemDataHandlers";
import { updatePlaylistImagesApi } from "core/api/items";
import { updateBoxItemPlayedByUserThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";

interface IProps {
  element: Playlist
  itemIndex: number
  offset?: number
  setElementDragging: (dragging: boolean) => void
  reorderingMode: boolean
  subId?: string
}

function ListRowPlaylist({ element, setElementDragging, itemIndex, offset = 0, reorderingMode, subId }: IProps) {
  const dispatch = useAppDispatch();
  const spotifyLoginData = useAppSelector(state => state.spotifyLoginData);
  const currentUser = useAppSelector(state => state.userData.authenticatedUser);
  const spotifyToken = spotifyLoginData?.genericToken;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element.boxItemId!, data: { index: itemIndex } })
  const playlistRowRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [elementImage, setElementImage] = useState(getElementImage(element, "small"));
  const { name, type, spotifyId, description, totalTracks, ownerDisplayName, ownerId, boxItemId, userPlays } = element;
  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
    transition
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

  const handleImageError = async () => {
    const itemResponse = await queryItemIdApi(element.type, element.spotifyId, spotifyToken!);
    if (!itemResponse.error) {
      const itemData = extractApiData(itemResponse);
      const itemImage = getElementImage(itemData);
      setElementImage(itemImage);
      updatePlaylistImagesApi(itemData.spotifyId!, (itemData as Playlist).images);
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, element: IProps["element"]) => {
    e.dataTransfer.setData("data", JSON.stringify(element))
    setElementDragging(true)
  }

  const handleDragEnd = () => {
    setElementDragging(false)
  }

  const handleTogglePlayedByUser = useCallback(
    () => {
      if (!currentUser) return;
      dispatch(updateBoxItemPlayedByUserThunk(currentUser.userId, element, type, !!userPlays?.length));
    },
    [dispatch, boxItemId, type, userPlays]
  );

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
            <div className={styles.flexColumn}>
              <div className={`${styles.name} ${styles.lineClamp}`}>
                <Link to={`/detail/${type}/${spotifyId}`}>
                  <span className={styles.nameText}>{name}</span>
                </Link>
              </div>
              <div className={`${styles.smallText} ${styles.lineClamp}`}>
                {description}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.colCentered} ${styles.mobileHidden} ${styles.smallText}`}>
          {totalTracks}
        </div>
        <div className={`${styles.colLeftAlgn} ${styles.mobileHidden} ${styles.smallText}`}>
          <Link to={getUri('user', ownerId)}><div className={styles.ownerName}> {ownerDisplayName} </div></Link>
        </div>
        <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
          <a href={getUri(type, spotifyId)}>
            <div className={styles.instantPlay}>
              <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
              <span> Open </span>
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
          <div className={`${styles.colRightAlgn} ${styles.smallText} ${styles.indexCol}`}>{itemIndex + offset + 1}</div>
          <div className={styles.colLeftAlgn}>
            <div className={styles.nameArtistCol}>
              <div className={styles.imgWrapper}>
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
              <div className={styles.flexColumn}>
                <div className={`${styles.name} ${styles.lineClamp}`}>
                  <Link to={`/detail/${type}/${spotifyId}`}>
                    <span className={styles.nameText}>{name}</span>
                  </Link>
                </div>
                <div className={`${styles.smallText} ${styles.lineClamp}`}>
                  {description}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colCentered} ${styles.mobileHidden} ${styles.smallText}`}>
            {totalTracks}
          </div>
          <div className={`${styles.colLeftAlgn} ${styles.mobileHidden} ${styles.smallText}`}>
            <Link to={getUri('user', ownerId)}><div className={styles.ownerName}> {ownerDisplayName} </div></Link>
          </div>
          <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
            <a href={getUri(type, spotifyId)}>
              <div className={styles.instantPlay}>
                <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
                <span> Open </span>
              </div>
            </a>
          </div>
          <div className={styles.itemMenu} ref={playlistRowRef} onClick={() => setIsMenuOpen(true)}>
            <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
          </div>
        </div>
        <PopperMenu referenceRef={playlistRowRef} placement={'left'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu
            itemData={element}
            itemIndex={itemIndex}
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
            itemType={element.type}
            subId={subId}
            isPlayedByUser={!!userPlays?.length}
            togglePlayedCallback={() => handleTogglePlayedByUser()}
          />
        </PopperMenu>
      </>
    )
  }
}

export default ListRowPlaylist;
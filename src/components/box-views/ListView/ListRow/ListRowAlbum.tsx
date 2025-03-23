import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Album } from "core/types/interfaces";
import styles from "./ListRowAlbum.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";
import { extractApiData, getElementImage } from "core/helpers/itemDataHandlers";
import { updateAlbumImagesApi } from "core/api/items";
import { updateBoxItemPlayedByUserThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";

interface IProps {
  element: Album
  itemIndex: number
  offset?: number
  setElementDragging: (dragging: boolean) => void
  reorderingMode: boolean
  subId?: string
}

function ListRowAlbum({ element, setElementDragging, itemIndex, offset = 0, reorderingMode, subId }: IProps) {
  const dispatch = useAppDispatch();
  const spotifyLoginData = useAppSelector(state => state.spotifyLoginData);
  const currentUser = useAppSelector(state => state.userData.authenticatedUser);
  const userQueue = useAppSelector(state => state.userQueueData.userQueue);
  const spotifyToken = spotifyLoginData?.genericToken;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element.boxItemId!, data: { index: itemIndex } })
  const albumRowRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [elementImage, setElementImage] = useState(getElementImage(element, "small"));
  const { name, type, artists, albumType, releaseDate, spotifyId, boxItemId, userPlays } = element;
  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const getArtistLinks = () => {
    const artistArray = artists.slice(0, 3).map((artist, idx, arr) => {
      return <Link to={`/detail/artist/${artist.spotifyId}`} key={idx}><span className={styles.artistName}> {`${artist.name}${arr[idx + 1] ? ", " : ""}`} </span> </Link>;
    })

    return artistArray;
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
      updateAlbumImagesApi(itemData.spotifyId!, (itemData as Album).images);
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
              <div className={styles.name}>
                <Link to={`/detail/${type}/${spotifyId}`}>
                  <span className={styles.nameText}>{name}</span>
                </Link>
              </div>
              <div className={styles.smallText}>
                {getArtistLinks()}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.colCentered} ${styles.smallText} ${styles.mobileHidden}`}>
          {releaseDate.split("-")[0]}
        </div>
        <div className={`${styles.colCentered} ${styles.mobileHidden} ${styles.smallText}`}>
          {`${albumType.charAt(0).toUpperCase()}${albumType.slice(1)}`}
        </div>
        <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
          <a href={`spotify:${type}:${spotifyId}`}>
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
                  {getArtistLinks()}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colCentered} ${styles.smallText} ${styles.mobileHidden}`}>
            {releaseDate.split("-")[0]}
          </div>
          <div className={`${styles.colCentered} ${styles.mobileHidden} ${styles.smallText}`}>
            {`${albumType.charAt(0).toUpperCase()}${albumType.slice(1)}`}
          </div>
          <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
            <a href={`spotify:${type}:${spotifyId}`}>
              <div className={styles.instantPlay}>
                <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
                <span> Open </span>
              </div>
            </a>
          </div>
          <div className={styles.itemMenu} ref={albumRowRef} onClick={() => setIsMenuOpen(true)}>
            <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
          </div>
        </div>
        <PopperMenu referenceRef={albumRowRef} placement={'left'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
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

export default ListRowAlbum;
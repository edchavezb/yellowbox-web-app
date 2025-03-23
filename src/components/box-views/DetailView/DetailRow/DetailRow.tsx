import { ReactElement, useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Artist, Album, Track, Playlist } from "core/types/interfaces";
import * as checkType from "core/helpers/typeguards";
import styles from "./DetailRow.module.css";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { setModalState } from "core/features/modal/modalSlice";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { extractApiData, getElementImage } from "core/helpers/itemDataHandlers";
import useWindowDimensions from "core/hooks/useWindowDimensions";
import { updateAlbumImagesApi, updateArtistImagesApi, updateTrackImagesApi, updatePlaylistImagesApi } from "core/api/items";
import { updateBoxItemPlayedByUserThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";

interface IProps<T> {
  element: T
  itemIndex: number
  setElementDragging: (dragging: boolean) => void
  reorderingMode: boolean
  subId?: string
  isUserLoggedIn?: boolean
}

function DetailRow<T extends Artist | Album | Track | Playlist>({ element, setElementDragging, itemIndex, reorderingMode, subId, isUserLoggedIn }: IProps<T>) {
  const { name, type, spotifyId, note, userPlays, boxItemId } = element;
  const isPlayedByUser = !!userPlays?.length;
  const dispatch = useAppDispatch();
  const detailRowRef = useRef(null);
  const spotifyLoginData = useAppSelector(state => state.spotifyLoginData);
  const spotifyToken = spotifyLoginData?.genericToken;
  const currentUser = useAppSelector(state => state.userData.authenticatedUser);
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes);
  const isOwner = userBoxes.some(box => box.boxId === currentBox.boxId);

  const { width } = useWindowDimensions();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element.boxItemId!, data: { index: itemIndex } })
  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [elementImage, setElementImage] = useState(getElementImage(element));

  let authorName!: ReactElement | JSX.Element[] | string;
  let metadata!: JSX.Element | string;

  const getArtistLinks = (artistArr: { name: string, spotifyId: string }[]) => {
    const artistArray = artistArr.slice(0, 3).map((artist, idx, arr) => {
      return <Link to={`/detail/artist/${artist.spotifyId}`} key={idx}><span className={styles.artistName}> {`${artist.name}${arr[idx + 1] ? ", " : ""}`} </span> </Link>;
    })
    return artistArray;
  }

  if (checkType.isAlbum(element)) {
    const { artists, albumType, releaseDate, totalTracks } = element;
    authorName = getArtistLinks(artists)

    metadata =
      <div className={styles.metaDataContainer}>
        <div className={styles.metaDataPill}>
          {`${albumType.charAt(0).toUpperCase()}${albumType.slice(1)}`}
        </div>
        <div className={styles.metaDataPill}>
          {`${releaseDate.split("-")[0]}`}
        </div>
        <div className={styles.metaDataPill}>
          {`${totalTracks} tracks`}
        </div>
        {
          isUserLoggedIn &&
          <div className={styles.metaDataPill}>
            <img className={styles.playedIcon} src={`/icons/${isPlayedByUser ? "checkcirclegreen" : "checkcirclegray"}.svg`} alt='menu' />
            <span> {isPlayedByUser ? "Played" : "Not Played"} </span>
          </div>
        }
      </div>
  }

  else if (checkType.isArtist(element)) {
    const { genres } = element as Artist
    authorName = ""

    metadata = genres ?
      <div className={styles.metaDataContainer}>
        {genres.slice(0, 3).map(e => {
          return (
            <div className={styles.metaDataPill} key={e}>
              {e.split(" ").map(word => {
                return `${word.charAt(0).toUpperCase()}${word.slice(1)} `
              })}
            </div>)
        })}
        {
          isUserLoggedIn &&
          <div className={styles.metaDataPill}>
            <img className={styles.playedIcon} src={`/icons/${isPlayedByUser ? "checkcirclegreen" : "checkcirclegray"}.svg`} alt='menu' />
            <span> {isPlayedByUser ? "Played" : "Not Played"} </span>
          </div>
        }
      </div>
      : ""
  }

  else if (checkType.isTrack(element)) {
    const { artists, albumReleaseDate, duration } = element
    authorName = getArtistLinks(artists)

    metadata =
      <div className={styles.metaDataContainer}>
        <div className={styles.metaDataPill}>
          {`${albumReleaseDate?.split("-")[0]}`}
        </div>
        <div className={styles.metaDataPill}>
          {`${Math.floor(duration / 60000)}`.padStart(2, '0') + ":" + `${Math.floor(duration % 60000 / 1000)}`.padStart(2, '0')}
        </div>
        {
          isUserLoggedIn &&
          <div className={styles.metaDataPill}>
            <img className={styles.playedIcon} src={`/icons/${isPlayedByUser ? "checkcirclegreen" : "checkcirclegray"}.svg`} alt='menu' />
            <span> {isPlayedByUser ? "Played" : "Not Played"} </span>
          </div>
        }
      </div>
  }

  else if (checkType.isPlaylist(element)) {
    const { ownerDisplayName, ownerId, description, totalTracks } = element;
    authorName = <a href={`spotify:user:${ownerId}`}><div className={styles.artistName}> {ownerDisplayName} </div></a>;

    metadata =
      <div className={styles.metaDataContainer}>
        {
          width > 1024 &&
          <div className={styles.metaDataPill}>
            {`${description}`}
          </div>
        }
        <div className={styles.metaDataPill}>
          {`${totalTracks} tracks`}
        </div>
        {
          isUserLoggedIn &&
          <div className={styles.metaDataPill}>
            <img className={styles.playedIcon} src={`/icons/${isPlayedByUser ? "checkcirclegreen" : "checkcirclegray"}.svg`} alt='menu' />
            <span> {isPlayedByUser ? "Played" : "Not Played"} </span>
          </div>
        }
      </div>
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

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, element: IProps<T>["element"]) => {
    e.dataTransfer.setData("data", JSON.stringify(element))
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

  const handleTogglePlayedByUser = useCallback(
    () => {
      if (!currentUser) return;
      dispatch(updateBoxItemPlayedByUserThunk(currentUser.userId, element, type, isPlayedByUser));
    },
    [dispatch, boxItemId, type, isPlayedByUser]
  );

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
        className={styles.itemRow}
        ref={setNodeRef}
        style={draggableStyle}
        {...listeners}
        {...attributes}
      >
        <div className={styles.dragHandle}>
          <img className={styles.reorderIcon} src="/icons/reorder.svg" alt="reorder"></img>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.itemLink}>
            <a href={`spotify:${type}:${spotifyId}`}>
              <div className={styles.instantPlay}>
                <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
                <span> Open </span>
              </div>
            </a>
            <img
              draggable="false"
              className={styles.itemImage}
              alt={name}
              src={elementImage}
              onError={handleImageError}
            />
            <div className={styles.positionMobile}>
              {itemIndex + 1}
            </div>
          </div>
        </div>
        <div className={styles.dataCol}>
          <div className={styles.itemName}>
            <Link to={`/detail/${type}/${spotifyId}`}> {name} </Link>
          </div>
          {type !== "artist" ?
            <div className={styles.artist}>
              {authorName}
            </div>
            : ""
          }
          {metadata}
        </div>
        <div className={styles.notesCol}>
          <div className={styles.notesPanel} onClick={() => dispatch(setModalState({ visible: true, type: "Item Note", boxId: currentBox.boxId, page: "", itemData: element }))}>
            <div className={styles.notesTitle}> NOTES </div>
            <div className={styles.notesDisplay}>
              {note}
            </div>
            <div className={styles.notesOverlay}>
              <div className={styles.overlayTitle}>  {!note && isOwner ? 'ADD NOTE ✎' : 'EXPAND ⛶'} </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  else {
    return (
      <>
        <div draggable onDragStart={(e) => handleDrag(e, element)} onDragEnd={() => handleDragEnd()} className={styles.itemRow}>
          <div className={styles.itemPosition}>{itemIndex + 1}</div>
          <div className={styles.imageColumn}>
            <div className={styles.imageContainer}>
              <a href={`spotify:${type}:${spotifyId}`}>
                <div className={styles.instantPlay}>
                  <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
                  <span> Open </span>
                </div>
              </a>
              <Link to={`/detail/${type}/${spotifyId}`} className={styles.itemLink} draggable="false">
                <img
                  draggable="false"
                  className={styles.itemImage}
                  alt={name}
                  src={elementImage}
                  onError={handleImageError}
                />
                <div className={styles.positionMobile}>
                  {itemIndex + 1}
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.dataCol}>
            <div className={styles.itemName}>
              <Link to={`/detail/${type}/${spotifyId}`}> {name} </Link>
            </div>
            {type !== "artist" ?
              <div className={styles.artist}>
                {authorName}
              </div>
              : ""
            }
            {metadata}
          </div>
          <div className={styles.notesCol}>
            <div className={styles.notesPanel} onClick={() => dispatch(setModalState({ visible: true, type: "Item Note", boxId: currentBox.boxId, page: "", subId, itemData: element }))}>
              <div className={styles.notesTitle}> NOTES </div>
              <div className={styles.notesDisplay}>
                {note}
              </div>
              <div className={styles.notesOverlay}>
                <div className={styles.overlayTitle}>
                  {!note && isOwner ? 'ADD NOTE ✎' : 'EXPAND ⛶'}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.itemMenu} ref={detailRowRef} onClick={() => setIsMenuOpen(true)}>
            <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
          </div>
        </div>
        <PopperMenu referenceRef={detailRowRef} placement={'left'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu
            itemData={element}
            itemIndex={itemIndex}
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
            itemType={element.type}
            subId={subId}
            isPlayedByUser={isPlayedByUser}
            togglePlayedCallback={() => handleTogglePlayedByUser()}
          />
        </PopperMenu>
      </>
    )
  }
}

export default DetailRow;
import { ReactElement, useRef, useState } from "react";
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
import { extractCrucialData, getElementImage } from "core/helpers/itemDataHandlers";
import { updateBoxAlbumApi, updateBoxArtistApi, updateBoxTrackApi, updateBoxPlaylistApi } from "core/api/userboxes";

interface IProps<T> {
  element: T
  index: number
  setElementDragging: (dragging: boolean) => void
  reorderingMode: boolean
  subId?: string
}

function DetailRow<T extends Artist | Album | Track | Playlist>({ element, setElementDragging, index, reorderingMode, subId }: IProps<T>) {
  const dispatch = useAppDispatch();
  const detailRowRef = useRef(null);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element._id!, data: {index}})
  const { name, type, uri, id } = element;
  const spotifyLoginData = useAppSelector(state => state.spotifyLoginData);
  const spotifyToken = spotifyLoginData?.genericToken;
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box)
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const isOwner = userBoxes.some(box => box.boxId === currentBox._id);
  const itemNote = currentBox.notes.find(note => note.itemId === id && note.subSectionId === subId) || currentBox.notes.find(note => note.itemId === id && !note.subSectionId)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [elementImage, setElementImage] = useState(getElementImage(element));
  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  //Telling compiler not to expect null or undefined since value is assiged for all cases (! operator)
  let authorName!: ReactElement | JSX.Element[] | string;
  let metadata!: JSX.Element | string;

  const getArtistLinks = (artistArr: Artist[]) => {
    const artistArray = artistArr.slice(0, 3).map((artist, idx, arr) => {
      return <Link to={`/detail/artist/${artist.id}`} key={idx}><span className={styles.artistName}> {`${artist.name}${arr[idx + 1] ? ", " : ""}`} </span> </Link>;
    })
    return artistArray;
  }

  if (checkType.isAlbum(element)) {
    const { artists, album_type, release_date, total_tracks } = element;
    authorName = getArtistLinks(artists)

    metadata =
      <div className={styles.metaDataContainer}>
        <div className={styles.metaDataPill}>
          {`${album_type.charAt(0).toUpperCase()}${album_type.slice(1)}`}
        </div>
        <div className={styles.metaDataPill}>
          {`${release_date.split("-")[0]}`}
        </div>
        <div className={styles.metaDataPill}>
          {`${total_tracks} tracks`}
        </div>
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
      </div>
      : ""
  }

  else if (checkType.isTrack(element)) {
    const { artists, album, duration_ms } = element
    authorName = getArtistLinks(artists)

    metadata =
      <div className={styles.metaDataContainer}>
        <div className={styles.metaDataPill}>
          {`${album!.release_date.split("-")[0]}`}
        </div>
        <div className={styles.metaDataPill}>
          {`${Math.floor(duration_ms / 60000)}`.padStart(2, '0') + ":" + `${Math.floor(duration_ms % 60000 / 1000)}`.padStart(2, '0')}
        </div>
      </div>
  }

  else if (checkType.isPlaylist(element)) {
    const { owner, description, tracks } = element;
    authorName = <a href={owner.uri}><div className={styles.artistName}> {owner.display_name} </div></a>;

    metadata =
      <div className={styles.metaDataContainer}>
        <div className={styles.metaDataPill}>
          {`${description}`}
        </div>
        <div className={styles.metaDataPill}>
          {`${tracks.total} tracks`}
        </div>
      </div>
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

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, element: IProps<T>["element"]) => {
    e.dataTransfer.setData("data", JSON.stringify(element))
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
            <a href={`${uri}:play`}>
              <div className={styles.instantPlay}>
                <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
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
        </div>
        <div className={styles.dataCol}>
          <div className={type === "track" || type === "album" ? styles.itemNameItalic : styles.itemName}>
            <Link to={`/detail/${type}/${id}`}> {name} </Link>
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
          <div className={styles.notesPanel} onClick={() => dispatch(setModalState({ visible: true, type: "Item Note", boxId: currentBox._id, page: "", itemData: element }))}>
            <div className={styles.notesTitle}> NOTES </div>
            <div className={styles.notesDisplay}>
              {itemNote?.noteText}
            </div>
            <div className={styles.notesOverlay}>
              <div className={styles.overlayTitle}> {itemNote?.noteText ? 'EXPAND ⛶' : 'ADD NOTE ✎'} </div>
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
          <div className={styles.itemPosition}>{index + 1}</div>
          <div className={styles.imageContainer}>
            <Link to={`/detail/${type}/${id}`} className={styles.itemLink} draggable="false">
              <a href={`${uri}:play`}>
                <div className={styles.instantPlay}>
                  <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
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
              
            </Link>
          </div>
          <div className={styles.dataCol}>
            <div className={type === "track" || type === "album" ? styles.itemNameItalic : styles.itemName}>
              <Link to={`/detail/${type}/${id}`}> {name} </Link>
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
            <div className={styles.notesPanel} onClick={() => dispatch(setModalState({ visible: true, type: "Item Note", boxId: currentBox._id, page: "", subId, itemData: element }))}>
              <div className={styles.notesTitle}> NOTES </div>
              <div className={styles.notesDisplay}>
                {itemNote?.noteText}
              </div>
              <div className={styles.notesOverlay}>
                <div className={styles.overlayTitle}>
                  {!itemNote?.noteText && isOwner ? 'ADD NOTE ✎' : 'EXPAND ⛶'}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.itemMenu} ref={detailRowRef} onClick={() => setIsMenuOpen(true)}>
            <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
          </div>
        </div>
        <PopperMenu referenceRef={detailRowRef} placement={'left'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu itemData={element} itemIndex={index} setIsOpen={setIsMenuOpen} itemType={element.type} subId={subId} />
        </PopperMenu>
      </>
    )
  }
}

export default DetailRow;
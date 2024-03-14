import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Album } from "core/types/interfaces";
import styles from "./ListRowAlbum.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";
import { extractCrucialData, getElementImage } from "core/helpers/itemDataHandlers";
import { updateBoxAlbumApi } from "core/api/userboxes/albums";

interface IProps {
  element: Album
  dbIndex?: number
  index: number
  offset?: number
  setElementDragging: (dragging: boolean) => void
  reorderingMode: boolean
  subId?: string
}

function ListRowAlbum({ element, setElementDragging, dbIndex, index, offset = 0, reorderingMode, subId }: IProps) {
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const spotifyLoginData = useAppSelector(state => state.spotifyLoginData);
  const spotifyToken = spotifyLoginData?.genericToken;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element._id!, data: { index: dbIndex || index } })
  const albumRowRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [elementImage, setElementImage] = useState(getElementImage(element, "small"));
  const { name, type, artists, album_type, release_date, id, uri } = element;
  const draggableStyle = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const getArtistLinks = () => {
    const artistArray = artists.slice(0, 3).map((artist, idx, arr) => {
      return <Link to={`/detail/artist/${artist.id}`} key={idx}><span className={styles.artistName}> {`${artist.name}${arr[idx + 1] ? ", " : ""}`} </span> </Link>;
    })

    return artistArray;
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
    const itemImage = getElementImage(itemResponse, "small");
    setElementImage(itemImage);
    const itemData = extractCrucialData(itemResponse);
    itemData._id = element._id
    updateBoxAlbumApi(currentBox._id, itemData._id!, itemData as Album)
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
                {getArtistLinks()}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.colCentered} ${styles.smallText}`}>
          {release_date.split("-")[0]}
        </div>
        <div className={`${styles.colCentered} ${styles.mobileHidden} ${styles.smallText}`}>
          {`${album_type.charAt(0).toUpperCase()}${album_type.slice(1)}`}
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
                  {getArtistLinks()}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.colCentered} ${styles.smallText}`}>
            {release_date.split("-")[0]}
          </div>
          <div className={`${styles.colCentered} ${styles.mobileHidden} ${styles.smallText}`}>
            {`${album_type.charAt(0).toUpperCase()}${album_type.slice(1)}`}
          </div>
          <div className={`${styles.colCentered} ${styles.mobileHidden}`}>
            <a href={uri}>
              <div className={styles.instantPlay}>
                <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify'></img>
                {type === "track" ? <span> Play </span> : <span> Open </span>}
              </div>
            </a>
          </div>
          <div className={styles.itemMenu} ref={albumRowRef} onClick={() => setIsMenuOpen(true)}>
            <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
          </div>
        </div>
        <PopperMenu referenceRef={albumRowRef} placement={'left'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu itemData={element} itemIndex={dbIndex || index} setIsOpen={setIsMenuOpen} itemType={element.type} subId={subId} />
        </PopperMenu>
      </>
    )
  }
}

export default ListRowAlbum;
import { ReactElement, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Artist, Album, Track, Playlist, ItemImage } from "../../core/types/interfaces";
import * as checkType from "../../core/helpers/typeguards";

import styles from "./GridItem.module.css";
import PopperMenu from "components/menus/popper/PopperMenu";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";

interface IProps<T> {
  element: T
  setElementDragging: (dragging: boolean) => void
}

function GridItem<T extends Artist | Album | Track | Playlist>({ element, setElementDragging }: IProps<T>) {
  const gridItemRef = useRef(null);
  const { name, type, uri, id } = element;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //Telling compiler not to expect null or undefined since value is assiged for all cases (! operator)
  let elementImages: ItemImage[] | undefined;
  let authorName!: ReactElement | string;

  if (checkType.isAlbum(element)) {
    const { images, artists } = element;
    authorName = <Link to={`/detail/artist/${artists[0].id}`}><div className={styles.artistName}> {artists[0].name} </div> </Link>
    elementImages = images
  }
  else if (checkType.isArtist(element)) {
    const { images } = element as Artist;
    authorName = ""
    elementImages = images
  }
  else if (checkType.isTrack(element)) {
    const { artists, album } = element;
    authorName = <Link to={`/detail/artist/${artists[0].id}`}><div className={styles.artistName}> {artists[0].name} </div> </Link>
    elementImages = album!.images;
  }
  else if (checkType.isPlaylist(element)) {
    const { images, owner } = element;
    authorName = <a href={owner.uri}><div className={styles.artistName}> {owner.display_name} </div></a>;
    elementImages = images
  }

  const itemCoverArt = elementImages && elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"

  const handleDrag = (event: React.DragEvent<HTMLDivElement>, element: IProps<T>["element"]) => {
    event.dataTransfer.setData("data", JSON.stringify(element))
    setElementDragging(true)
  }

  const handleDragEnd = () => {
    setElementDragging(false)
  }

  return (
    <>
      <div
        draggable
        onDragStart={(event) => handleDrag(event, element)}
        onDragEnd={() => handleDragEnd()}
        className={styles.itemCard}
      >
        <div className={styles.imageContainer} ref={gridItemRef}>
          <a href={`${uri}:play`}>
            <div className={styles.instantPlay}>
              <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify' />
              {type === "track" ? <span> Play </span> : <span> Open </span>}
            </div>
          </a>
          <div className={styles.itemMenu} onClick={() => setIsMenuOpen(true)}>
            <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
          </div>
          <img draggable="false" className={styles.itemImage} alt={name} src={itemCoverArt}></img>
        </div>
        <Link to={`/detail/${type}/${id}`}> <div className={styles.name}> {name} </div> </Link>
        {authorName}
      </div>
      <PopperMenu referenceRef={gridItemRef} placement={'right-start'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
        <BoxItemMenu itemData={element} setIsOpen={setIsMenuOpen} />
      </PopperMenu>
    </>
  )
}

export default GridItem;
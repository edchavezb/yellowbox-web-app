import { Album, ApiAlbum, ApiTrack, Track } from "core/types/interfaces";
import styles from "./AlbumHeader.module.css"
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { extractApiData, getUri } from "core/helpers/itemDataHandlers";

interface AlbumHeaderProps {
  itemData: ApiAlbum
}

const AlbumHeader = ({ itemData }: AlbumHeaderProps) => {
  const [isItemMenuOpen, setIsItemMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);

  const getAlbumRuntime = (tracks: ApiTrack[]) => {
    const milliSecs = tracks
      .map(track => track.duration_ms)
      .reduce(
        (prev, curr) => { return prev + curr }
      );
    const minutes = Math.floor(milliSecs / 60000);
    return `${minutes} min`
  }

  return (
    <>
      <div className={styles.itemDataViewer}>
        <div className={styles.imageWrapper}>
          <img
            className={styles.itemImage}
            src={
              itemData.images![0]?.url || "https://via.placeholder.com/150"
            }
            alt={itemData.name}
          >
          </img>
        </div>
        <div className={styles.metadataContainer}>
          <div className={styles.itemTitle}> {itemData.name} </div>
          <div className={styles.itemArtist}>
            {`${itemData.album_type.charAt(0).toUpperCase()}${itemData.album_type.slice(1)}`}
            {` by `}
            {itemData.artists.slice(0, 3).map((artist, idx, arr) => {
              return (
                <Link to={`/detail/artist/${artist.id}`} key={idx}>
                  <span className={styles.artistName}>
                    {`${artist.name}${arr[idx + 1] ? ", " : ""}`}
                  </span>
                </Link>
              )
            })}
          </div>
          <div className={styles.detailsRow}>
            <div className={styles.metaDataPill}>
              {`${itemData.release_date.split("-")[0]}`}
            </div>
            <div className={styles.metaDataPill}>
              {` ${getAlbumRuntime(itemData.tracks!.items)}`}
            </div>
            <a href={getUri(itemData.type, itemData.id)}>
              <div className={styles.metaDataPill}>
                <img className={styles.spotifyIcon} src='/icons/spotify_icon.png' alt='spotify' />
                <span> Open </span>
              </div>
            </a>
            <div className={styles.menuButtonMobile} onClick={() => setIsItemMenuOpen(true)} ref={menuToggleRef}>
              <img className={styles.dotsIcon} src="/icons/ellipsis.svg" alt='menu' />
            </div>
          </div>
        </div>
      </div>
      <PopperMenu referenceRef={menuToggleRef} placement={'bottom-start'} isOpen={isItemMenuOpen} setIsOpen={setIsItemMenuOpen}>
        <BoxItemMenu itemData={extractApiData(itemData)} itemType={itemData.type} isOpen={isItemMenuOpen} setIsOpen={setIsItemMenuOpen} />
      </PopperMenu>
    </>
  )
}

export default AlbumHeader;
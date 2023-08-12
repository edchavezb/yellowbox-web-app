import { Playlist, PlaylistItem, Track } from "core/types/interfaces";
import styles from "./PlaylistHeader.module.css"
import { useRef, useState } from "react";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";

interface PlaylistHeaderProps {
  itemData: Playlist
}

const PlaylistHeader = ({itemData}: PlaylistHeaderProps) => {
  const [isItemMenuOpen, setIsItemMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);

  const getPlaylistRuntime = (tracks: Track[]) => {
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
        <img
          className={styles.itemImage}
          src={
            itemData.images![0]?.url || "https://via.placeholder.com/150"
          }
          alt={itemData.name}
        >
        </img>
        <div className={styles.metadataContainer}>
          <div className={styles.itemTitle}> {itemData.name} </div>
          <div className={styles.itemArtist}>
            {`${itemData.type.charAt(0).toUpperCase()}${itemData.type.slice(1)}`}
            {` by `}<a href={itemData.owner.uri}><span> {itemData.owner.display_name} </span></a> 
          </div>
          <div className={styles.detailsRow}>
            <div className={styles.metaDataPill}>
              {` ${getPlaylistRuntime(itemData.tracks!.items!.map(item => item.track))}`}
            </div>
            <a href={itemData.uri}>
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
        <BoxItemMenu itemData={itemData} itemType={itemData.type} setIsOpen={setIsItemMenuOpen} />
      </PopperMenu>
    </>
  )
}

export default PlaylistHeader;
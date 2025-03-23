import { ApiPlaylist, ApiTrack, Playlist, Track } from "core/types/interfaces";
import styles from "./PlaylistHeader.module.css"
import { useRef, useState } from "react";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { extractApiData, getUri } from "core/helpers/itemDataHandlers";

interface PlaylistHeaderProps {
  itemData: ApiPlaylist
  isPlayedByUser: boolean
  handleTogglePlayed: () => void
  isUserLoggedIn: boolean
}

const PlaylistHeader = ({ itemData, isPlayedByUser, handleTogglePlayed, isUserLoggedIn }: PlaylistHeaderProps) => {
  const [isItemMenuOpen, setIsItemMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);

  const getPlaylistRuntime = (tracks: ApiTrack[]) => {
    const milliSecs = tracks
      .map(track => track.duration_ms)
      .reduce(
        (prev, curr) => { return prev + curr }
      );
    const hours = Math.floor(milliSecs / 3600000);
    const minutes = Math.floor((milliSecs % 3600000) / 60000);
    return `${hours} hours, ${minutes} min`
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
            {`${itemData.type.charAt(0).toUpperCase()}${itemData.type.slice(1)}`}
            {` by `}<a href={itemData.owner.uri}><span> {itemData.owner.display_name} </span></a>
          </div>
          <div className={styles.detailsRow}>
            <div className={styles.metaDataPill}>
              {` ${getPlaylistRuntime(itemData.tracks!.items!.map(item => item.track))}`}
            </div>
            { isUserLoggedIn &&
              <div className={styles.metaDataPill}>
                <img className={styles.playedIcon} src={`/icons/${isPlayedByUser ? "checkcirclegreen" : "checkcirclegray"}.svg`} alt='menu' />
                <span> {isPlayedByUser ? "Played" : "Not Played"} </span>
              </div>
            }
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
        <BoxItemMenu itemData={extractApiData(itemData)} itemType={itemData.type} isOpen={isItemMenuOpen} setIsOpen={setIsItemMenuOpen} isPlayedByUser={isPlayedByUser} togglePlayedCallback={handleTogglePlayed} />
      </PopperMenu>
    </>
  )
}

export default PlaylistHeader;
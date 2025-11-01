import { ApiTrack, Track } from "core/types/interfaces";
import styles from "./TrackHeader.module.css"
import { useRef, useState } from "react";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { Link } from "react-router-dom";
import { extractApiData } from "core/helpers/itemDataHandlers";

interface TrackHeaderProps {
  itemData: ApiTrack
  isPlayedByUser: boolean
  handleTogglePlayed: () => void
  isUserLoggedIn: boolean
}

const TrackHeader = ({ itemData, isPlayedByUser, handleTogglePlayed, isUserLoggedIn }: TrackHeaderProps) => {
  const [isItemMenuOpen, setIsItemMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);

  return (
    <>
      <div className={styles.itemDataViewer}>
        <div className={styles.imageWrapper}>
          <img
            className={styles.itemImage}
            src={
              itemData.album?.images![0]?.url || "https://via.placeholder.com/150"
            }
            alt={itemData.name}
          >
          </img>
        </div>
        <div className={styles.metadataContainer}>
          <div className={styles.itemTitle}> {itemData.name} </div>
          <div className={styles.itemArtist}>
            {`${itemData.type.charAt(0).toUpperCase()}${itemData.type.slice(1)}`}
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
              {` ${itemData.album!.release_date.split("-")[0]}`}
            </div>
            <div className={styles.metaDataPill}>
              {` ${Math.floor(itemData.duration_ms / 60000)}`.padStart(2, "0") + ":" + `${Math.floor(itemData.duration_ms % 60000 / 1000)}`.padStart(2, "0")}
            </div>
            { isUserLoggedIn &&
              <div className={`${styles.metaDataPill} ${styles.mobileHidden}`}>
                <img className={styles.playedIcon} src={`/icons/${isPlayedByUser ? "checkcirclegreen" : "checkcirclegray"}.svg`} alt='menu' />
                <span> {isPlayedByUser ? "Played" : "Not Played"} </span>
              </div>
            }
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
        <BoxItemMenu itemData={extractApiData(itemData)} itemType={itemData.type} isOpen={isItemMenuOpen} setIsOpen={setIsItemMenuOpen} isPlayedByUser={isPlayedByUser} togglePlayedCallback={handleTogglePlayed}/>
      </PopperMenu>
    </>
  )
}

export default TrackHeader;
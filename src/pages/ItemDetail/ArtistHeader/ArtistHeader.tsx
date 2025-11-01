import { ApiArtist } from "core/types/interfaces";
import styles from "./ArtistHeader.module.css"
import { useRef, useState } from "react";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { extractApiData } from "core/helpers/itemDataHandlers";

interface ArtistHeaderProps {
  itemData: ApiArtist
  isPlayedByUser: boolean
  handleTogglePlayed: () => void
  isUserLoggedIn: boolean
}

const ArtistHeader = ({ itemData, isPlayedByUser, handleTogglePlayed, isUserLoggedIn  }: ArtistHeaderProps) => {
  const [isItemMenuOpen, setIsItemMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);

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
          <div className={styles.itemDetails}>
            {itemData.genres &&
              itemData.genres.slice(0, 3).map((genre, idx, arr) => {
                return (
                  <span key={genre}>
                    {genre.split(" ").map((word, i, a) => {
                      return `${word.charAt(0).toUpperCase()}${word.slice(1)}${a[i + 1] ? " " : ""}`
                    })}{arr[idx + 1] ? ", " : ""}
                  </span>
                )
              })}
          </div>
          <div className={styles.detailsRow}>
            <div className={styles.metaDataPill}>
              <span> Popularity </span>
              <div className={styles.progressBarRail}> 
                <div className={styles.progressBar} style={{width: `${itemData.popularity}%`}}/>
              </div>
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
        <BoxItemMenu itemData={extractApiData(itemData)} itemType={itemData.type} isOpen={isItemMenuOpen} setIsOpen={setIsItemMenuOpen} isPlayedByUser={isPlayedByUser} togglePlayedCallback={handleTogglePlayed} />
      </PopperMenu>
    </>
  )
}

export default ArtistHeader;
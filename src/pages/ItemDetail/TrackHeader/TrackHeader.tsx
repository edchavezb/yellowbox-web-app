import { Track } from "core/types/interfaces";
import styles from "./TrackHeader.module.css"
import { useRef, useState } from "react";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";
import { Link } from "react-router-dom";

interface TrackHeaderProps {
  itemData: Track
}

const TrackHeader = ({ itemData }: TrackHeaderProps) => {
  const [isItemMenuOpen, setIsItemMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);

  return (
    <>
      <div className={styles.itemDataViewer}>
        <img
          className={styles.itemImage}
          src={
            itemData.album?.images![0]?.url || "https://via.placeholder.com/150"
          }
          alt={itemData.name}
        >
        </img>
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
            {
              itemData.explicit &&
              <div className={styles.metaDataPill}>
                {'EXPLICIT'}
              </div>
            }
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

export default TrackHeader;
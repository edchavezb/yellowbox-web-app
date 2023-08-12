import { Artist } from "core/types/interfaces";
import styles from "./ArtistHeader.module.css"
import { useRef, useState } from "react";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import PopperMenu from "components/menus/popper/PopperMenu";

interface ArtistHeaderProps {
  itemData: Artist
}

const ArtistHeader = ({ itemData }: ArtistHeaderProps) => {
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
        </div>
      </div>
      <PopperMenu referenceRef={menuToggleRef} placement={'bottom-start'} isOpen={isItemMenuOpen} setIsOpen={setIsItemMenuOpen}>
        <BoxItemMenu itemData={itemData} itemType={itemData.type} setIsOpen={setIsItemMenuOpen} />
      </PopperMenu>
    </>
  )
}

export default ArtistHeader;
import { Link } from 'react-router-dom';
import { ApiAlbum, ApiTrack, ApiArtist } from 'core/types/interfaces';
import styles from "./TopListRow.module.css";

interface IProps {
  item: ApiArtist | ApiAlbum | ApiTrack
  type: TopItemsSelectItems
}

enum TopItemsSelectItems {
  ALBUMS = 'ALBUMS',
  TRACKS = 'TRACKS',
  ARTISTS = 'ARTISTS'
}

function TopListRow({ item, type }: IProps) {
  const getItemImage = () => {
    let imageSrc;
    switch (type) {
      case TopItemsSelectItems.ALBUMS:
        imageSrc = (item as ApiAlbum).images[1].url
        break;
      case TopItemsSelectItems.ARTISTS:
        imageSrc = (item as ApiArtist).images![1].url
        break;
      case TopItemsSelectItems.TRACKS:
        imageSrc = (item as ApiTrack).album?.images![1].url
        break;
      default:
        break;
    }
    return imageSrc;
  }

  return (
    <>
      {
        type === TopItemsSelectItems.ARTISTS &&
        <div className={styles.topItem}>
          <img src={getItemImage() ?? ''} className={styles.itemImage} alt={item.name} />
          <div className={styles.itemData}>
            <Link to={`/detail/artist/${(item as ApiArtist).id}`}>
              <div className={styles.artistName}> {item.name} </div>
            </Link>
          </div>
        </div>
      }
      {
        type === TopItemsSelectItems.TRACKS &&
        <div className={styles.topItem}>
          <img src={getItemImage() ?? ''} className={styles.itemImage} alt={item.name} />
          <div className={styles.itemData}>
            <Link to={`/detail/track/${(item as ApiTrack).id}`}>
              <div className={styles.itemDataName}>
                {item.name}
              </div>
            </Link>
            <Link to={`/detail/artist/${(item as ApiTrack).artists[0].id}`}>
              <div className={styles.itemDataArtist}>
                {(item as ApiTrack).artists[0].name}
              </div>
            </Link>
          </div>
        </div>
      }
      {
        type === TopItemsSelectItems.ALBUMS &&
        <div className={styles.topItem}>
          <img src={getItemImage() ?? ''} className={styles.itemImage} alt={item.name} />
          <div className={styles.itemData}>
            <Link to={`/detail/album/${(item as ApiAlbum).id}`}>
              <div className={styles.itemDataName}>
                {item.name}
              </div>
            </Link>
            <Link to={`/detail/artist/${(item as ApiAlbum).artists[0].id}`}>
              <div className={styles.itemDataArtist}>
                {(item as ApiAlbum).artists[0].name}
              </div>
            </Link>
          </div>
        </div>
      }
    </>
  )
}

export default TopListRow;
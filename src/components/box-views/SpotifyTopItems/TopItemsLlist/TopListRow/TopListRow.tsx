import { Link } from 'react-router-dom';
import { Album, Track, Artist } from 'core/types/interfaces';
import styles from "./TopListRow.module.css";

interface IProps {
  item: Artist | Album | Track
  type: TopItemsSelectItems
}

enum TopItemsSelectItems {
  ALBUMS = 'ALBUMS',
  TRACKS = 'TRACKS',
  ARTISTS = 'ARTISTS'
}

function TopListRow({item, type}: IProps) {
  const getItemImage = () => {
    let imageSrc;
    switch(type){
      case TopItemsSelectItems.ALBUMS:
        imageSrc = (item as Album).images[1].url
        break;
      case TopItemsSelectItems.ARTISTS:
        imageSrc = (item as Artist).images![1].url
        break;
      case TopItemsSelectItems.TRACKS:
        imageSrc = (item as Track).album?.images![1].url
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
          <img src={getItemImage() ?? ''} className={styles.itemImage}></img>
          <div className={styles.itemData}>
            <Link to={`/detail/artist/${(item as Artist).id}`}>
              <div className={styles.artistName}> {item.name} </div>
            </Link>
          </div>
        </div>
      }
      {
        type === TopItemsSelectItems.TRACKS &&
        <div className={styles.topItem}>
          <img src={getItemImage() ?? ''} className={styles.itemImage}></img>
          <div className={styles.itemData}> 
            <Link to={`/detail/track/${(item as Track).id}`}>
              <div className={styles.itemDataName}>
                {item.name}
              </div>
            </Link>
            <Link to={`/detail/artist/${(item as Track).artists[0].id}`}>
              <div className={styles.itemDataArtist}>
                {(item as Track).artists[0].name}
              </div>
            </Link>
          </div>
        </div>
      }
      {
        type === TopItemsSelectItems.ALBUMS &&
        <div className={styles.topItem}>
          <img src={getItemImage() ?? ''} className={styles.itemImage}></img>
          <div className={styles.itemData}> 
            <Link to={`/detail/album/${(item as Album).id}`}>
              <div className={styles.itemDataName}>
                {item.name}
              </div>
            </Link>
            <Link to={`/detail/artist/${(item as Album).artists[0].id}`}>
              <div className={styles.itemDataArtist}>
                {(item as Album).artists[0].name}
              </div>
            </Link>
          </div>
        </div>
      }
    </>
  )
}

export default TopListRow;
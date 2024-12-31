import { ApiArtist, ApiAlbum, ApiTrack } from 'core/types/interfaces';
import styles from "./MostPlayedItem.module.css";
import { Link } from 'react-router-dom';

enum TopItemsSelectItems {
  ALBUMS = 'ALBUMS',
  TRACKS = 'TRACKS',
  ARTISTS = 'ARTISTS'
}

interface IProps {
  item: ApiArtist | ApiAlbum | ApiTrack;
  type: TopItemsSelectItems
}

function MostPlayedItem({ item, type }: IProps) {
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
    <div className={styles.mostPlayedWrapper}>
      <Link to={`/detail/${item.type}/${(item as ApiArtist).id}`}>
        <img src={getItemImage()} className={styles.mostPlayedImage} alt={item.name} />
      </Link>
      <div className={styles.mostPlayedData}>
        <div className={styles.sectionTitle}> MOST PLAYED {item.type.toUpperCase()} </div>
        <div className={styles.itemName}>
          <Link to={`/detail/${item.type}/${(item as ApiArtist).id}`}>
            {item.name}
          </Link>
        </div>
        {
          item.type !== 'artist' &&
          <div className={styles.itemArtist}>
            <Link to={`/detail/artist/${(item as ApiAlbum | ApiTrack).artists[0].id}`}>
              {(item as ApiAlbum | ApiTrack).artists[0].name}
            </Link>
          </div>
        }
      </div>
    </div>
  )
}

export default MostPlayedItem;
import { Album, Track, Artist } from 'core/types/interfaces';
import styles from "./MostPlayedItem.module.css";

enum TopItemsSelectItems {
  ALBUMS = 'ALBUMS',
  TRACKS = 'TRACKS',
  ARTISTS = 'ARTISTS'
}

interface IProps {
  item: Artist | Album | Track;
  type: TopItemsSelectItems
}

function MostPlayedItem({ item, type }: IProps) {
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
    <div className={styles.mostPlayedWrapper}>
      <img src={getItemImage()} className={styles.mostPlayedImage} alt={item.name}/>
      <div className={styles.mostPlayedData}>
        <div className={styles.sectionTitle}> MOST PLAYED {item.type.toUpperCase()} </div>
        <div className={styles.itemName}>
          {item.name}
        </div>
        {
          item.type !== 'artist' &&
          <div className={styles.itemArtist}>
            {(item as Album | Track).artists[0].name}
          </div>
        }
      </div>
    </div>
  )
}

export default MostPlayedItem;
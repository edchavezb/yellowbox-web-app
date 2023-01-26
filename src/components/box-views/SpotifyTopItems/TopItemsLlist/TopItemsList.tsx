import { Album, Track, Artist } from 'core/types/interfaces';
import styles from "./TopItemsList.module.css";
import TopListRow from './TopListRow/TopListRow';

enum TopItemsSelectItems {
  ALBUMS = 'ALBUMS',
  TRACKS = 'TRACKS',
  ARTISTS = 'ARTISTS'
}

interface IProps {
  items: Artist[] | Album[] | Track[]
  type: TopItemsSelectItems
}

function TopItemsList({ items, type }: IProps) {
  return (
    <>
      <div className={styles.topListTitle}> Your top 10 </div>
      <div className={styles.itemList}>
        {
          items.map((item: Artist | Album | Track) => {
            return (
              <TopListRow item={item} type={type}/>
            )
          })
        }
      </div>
    </>
  )
}

export default TopItemsList;
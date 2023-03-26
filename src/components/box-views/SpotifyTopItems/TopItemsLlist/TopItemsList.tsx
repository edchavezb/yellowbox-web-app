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
        <div className={styles.itemGroup}>
          <div className={styles.rankColumn}>
            {
              items.slice(0, 5).map((item: Artist | Album | Track, index: number) => {
                return (
                  <div className={styles.rankNumber}>
                    {index + 1}
                  </div>
                )
              })
            }
          </div>
          <div className={styles.itemColumn}>
            {
              items.slice(0, 5).map((item: Artist | Album | Track, index: number) => {
                return (
                  <TopListRow item={item} index={index} type={type} />
                )
              })
            }
          </div>
        </div>
        <div className={styles.itemGroup}>
          <div className={styles.rankColumn}>
            {
              items.slice(5, 10).map((item: Artist | Album | Track, index: number) => {
                return (
                  <div className={styles.rankNumber}>
                    {index + 6}
                  </div>
                )
              })
            }
          </div>
          <div className={styles.itemColumn}>
            {
              items.slice(5, 10).map((item: Artist | Album | Track, index: number) => {
                return (
                  <TopListRow item={item} index={index} type={type} />
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default TopItemsList;
import { ApiAlbum, ApiTrack, ApiArtist } from 'core/types/interfaces';
import styles from "./TopItemsList.module.css";
import TopListRow from './TopListRow/TopListRow';

enum TopItemsSelectItems {
  ALBUMS = 'ALBUMS',
  TRACKS = 'TRACKS',
  ARTISTS = 'ARTISTS'
}

interface IProps {
  items: ApiArtist[] | ApiAlbum[] | ApiTrack[]
  type: TopItemsSelectItems
}

function TopItemsList({ items, type }: IProps) {
  return (
    <>
      <div className={styles.topListTitle}> Your top 10 </div>
      <div className={styles.itemList}>
        <div className={`${styles.itemGroup} ${styles.mobileVisible}`}>
          <div className={styles.rankColumn}>
            {
              items.slice(0, 10).map((_item: ApiArtist | ApiAlbum | ApiTrack, index: number) => {
                return (
                  <div className={styles.rankNumber} key={index}>
                    {index + 1}
                  </div>
                )
              })
            }
          </div>
          <div className={styles.itemColumn}>
            {
              items.slice(0, 10).map((item: ApiArtist | ApiAlbum | ApiTrack) => {
                return (
                  <TopListRow item={item} type={type} key={item.id} />
                )
              })
            }
          </div>
        </div>
        <div className={`${styles.itemGroup} ${styles.mobileHidden}`}>
          <div className={styles.rankColumn}>
            {
              items.slice(0, 5).map((_item: ApiArtist | ApiAlbum | ApiTrack, index: number) => {
                return (
                  <div className={styles.rankNumber} key={index}>
                    {index + 1}
                  </div>
                )
              })
            }
          </div>
          <div className={styles.itemColumn}>
            {
              items.slice(0, 5).map((item: ApiArtist | ApiAlbum | ApiTrack) => {
                return (
                  <TopListRow item={item} type={type} key={item.id} />
                )
              })
            }
          </div>
        </div>
        <div className={`${styles.itemGroup} ${styles.mobileHidden}`}>
          <div className={styles.rankColumn}>
            {
              items.slice(5, 10).map((_item: ApiArtist | ApiAlbum | ApiTrack, index: number) => {
                return (
                  <div className={styles.rankNumber} key={index + 6}>
                    {index + 6}
                  </div>
                )
              })
            }
          </div>
          <div className={styles.itemColumn}>
            {
              items.slice(5, 10).map((item: ApiArtist | ApiAlbum | ApiTrack) => {
                return (
                  <TopListRow item={item} type={type} key={item.id} />
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
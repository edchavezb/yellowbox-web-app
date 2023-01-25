import { useState } from 'react';
import { Artist, Album, Track, Playlist } from "../../core/types/interfaces";

import GridItem from "./GridItem"
import styles from "./GridView.module.css";

interface IProps<T> {
  data: T[]
  page: string
  boxId?: string
  isOwner?: boolean,
  customSorting?: boolean
}

function GridView<T extends Artist | Album | Track | Playlist> ({data, isOwner, page, boxId, customSorting}: IProps<T>) {

  const [elementDragging, setElementDragging] = useState(false)

  return (
    <div className={styles.itemContainer}>
      {data.map((e) => {
          return <GridItem<T> key={e.id} element={e} setElementDragging={setElementDragging} />
      })}
    </div>
  )
}

export default GridView;
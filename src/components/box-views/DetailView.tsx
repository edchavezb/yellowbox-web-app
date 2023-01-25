import { useState } from 'react';
import { Artist, Album, Track, Playlist } from "../../core/types/interfaces";

import DetailRow from './DetailRow';
import styles from "./DetailView.module.css";

interface IProps<T> {
  data: T[]
  page: string
  boxId: string
  isOwner?: boolean
  customSorting: boolean
}

function DetailView<T extends Artist | Album | Track | Playlist>({isOwner, data, page, boxId}: IProps<T>) {
  const [elementDragging, setElementDragging] = useState(false)

  return (
    <div className={styles.itemContainer}>
      {data.map((e) => {
          return <DetailRow key={e.id} index={data.indexOf(e)} element={e} setElementDragging={setElementDragging} />
      })}
    </div>
  )
}

export default DetailView;
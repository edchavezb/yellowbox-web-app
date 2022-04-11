import React, { useState } from 'react';
import { Artist, Album, Track, Playlist } from "../../interfaces";

import GridItem from "./GridItem"
import DragActions from "../layout/DragActions"
import styles from "./GridView.module.css";

interface IProps<T> {
  data: T[]
  page: string
  boxId: string
  toggleModal: (toggle: boolean) => void
}

function GridView<T extends Artist | Album | Track | Playlist> ({data, page, toggleModal, boxId}: IProps<T>) {

  const [elementDragging, setElementDragging] = useState(false)

  return (
    <div className={styles.itemContainer}>
      {data.map((e) => {
          return <GridItem<T> key={e.id} element={e} setElementDragging={setElementDragging} />
      })}
      <DragActions elementDragging={elementDragging} page={page} toggleModal={toggleModal} boxId={boxId} />
    </div>
  )
}

export default GridView;
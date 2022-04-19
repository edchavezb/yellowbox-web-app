import React, { Dispatch, SetStateAction, useState } from 'react';
import { Artist, Album, Track, Playlist, ModalState } from "../../interfaces";

import GridItem from "./GridItem"
import DragActions from "../layout/DragActions"
import styles from "./GridView.module.css";

interface IProps<T> {
  data: T[]
  page: string
  boxId: string
  customSorting: boolean
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function GridView<T extends Artist | Album | Track | Playlist> ({data, page, toggleModal, boxId, customSorting}: IProps<T>) {

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
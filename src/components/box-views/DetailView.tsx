import { Dispatch, SetStateAction, useState } from 'react';
import { Artist, Album, Track, Playlist, ModalState } from "../../core/types/interfaces";

import DetailRow from './DetailRow';
import DragActions from "../layout/DragActions"
import styles from "./DetailView.module.css";

interface IProps<T> {
  data: T[]
  page: string
  boxId: string
  isOwner?: boolean
  customSorting: boolean
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function DetailView<T extends Artist | Album | Track | Playlist>({isOwner, data, page, toggleModal, boxId}: IProps<T>) {
  const [elementDragging, setElementDragging] = useState(false)

  return (
    <div className={styles.itemContainer}>
      {data.map((e) => {
          return <DetailRow key={e.id} index={data.indexOf(e)} element={e} setElementDragging={setElementDragging} />
      })}
      <DragActions isOwner={isOwner} elementDragging={elementDragging} page={page} toggleModal={toggleModal} boxId={boxId} />
    </div>
  )
}

export default DetailView;
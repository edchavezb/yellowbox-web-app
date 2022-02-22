import { useState } from 'react';

import DetailItem from './DetailItem';
import DragActions from "../layout/DragActions"
import styles from "./DetailView.module.css";

function DetailView({data, page, toggleModal, boxId}) {
  const [elementDragging, setElementDragging] = useState(false)

  return (
    <div className={styles.itemContainer}>
      {data.map((e) => {
          return <DetailItem key={e.id} index={data.indexOf(e)} element={e} page={page} setElementDragging={setElementDragging} />
      })}
      <DragActions elementDragging={elementDragging} page={page} toggleModal={toggleModal} boxId={boxId} />
    </div>
  )
}

export default DetailView;
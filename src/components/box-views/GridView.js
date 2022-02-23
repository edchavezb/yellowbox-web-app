import React, { useState } from 'react';

import GridItem from "./GridItem"
import DragActions from "../layout/DragActions"
import styles from "./GridView.module.css";

function GridView({data, page, toggleModal, boxId}) {

  const [elementDragging, setElementDragging] = useState(false)

  return (
    <div className={styles.itemContainer}>
      {data.map((e) => {
          return <GridItem key={e.id} element={e} page={page} setElementDragging={setElementDragging} />
      })}
      <DragActions elementDragging={elementDragging} page={page} toggleModal={toggleModal} boxId={boxId} />
    </div>
  )
}

export default GridView;
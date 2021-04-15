import React, { useState, useEffect } from 'react';

import GridItem from "./GridItem"
import DragActions from "../DragActions"
import styles from "./GridView.module.css";

function GridView(props) {

  const [elementDragging, setElementDragging] = useState(false)

  return (
    <div className={styles.itemContainer}>
      {props.data.map((e) => {
          return <GridItem key={e.id} element={e} setElementDragging={setElementDragging} />
      })}
      <DragActions elementDragging={elementDragging} page={props.page} toggleModal={props.toggleModal} boxId={props.boxId} />
    </div>
  )
}

export default GridView;
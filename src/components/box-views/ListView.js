import React, { useState, useEffect } from 'react';

import GridItem from "./GridItem"
import DragActions from "../DragActions"
import styles from "./ListView.module.css";

function ListView(props) {

  const [elementDragging, setElementDragging] = useState(false)

  return (
    <div className={styles.itemContainer}>
      {props.data.map((e) => {
          return <GridItem key={e.id} element={e} page={props.page} setElementDragging={setElementDragging} />
      })}
      <DragActions elementDragging={elementDragging} toggleModal={props.toggleModal} boxId={props.boxId} />
    </div>
  )
}

export default ListView;
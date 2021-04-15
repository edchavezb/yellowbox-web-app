import React, { useState, useEffect } from 'react';

import GridItem from "./GridItem"
import styles from "./ListView.module.css";

function ListView(props) {
  return (
    <div className={styles.itemContainer}>
      {props.data.map((e) => {
          return <GridItem key={e.id} element={e} page={props.page} setElementDragging={props.setElementDragging} />
      })}
    </div>
  )
}

export default ListView;
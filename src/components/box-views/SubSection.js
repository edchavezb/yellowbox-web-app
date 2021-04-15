import React, { useState, useEffect } from 'react';

import GridItem from "./GridItem"
import styles from "./SubSection.module.css";

function SubSection(props) {
  const itemsMatch = props.itemsMatch
  const subName = props.subName
  console.log(itemsMatch)

  return (itemsMatch.length > 0 ?
    <div className={styles.subSection} key={subName}>
      <div className={styles.subSectionName}> {subName} </div>
      <div className={styles.itemContainer}>
        {itemsMatch.map((e) => {
          return <GridItem key={e.id} element={e} livesInBox={true} setElementDragging={props.setElementDragging} />
        })}
      </div>
    </div>
    : "")
}

export default SubSection;
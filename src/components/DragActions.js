import React, { useState, useEffect } from 'react';

import styles from "./DragActions.module.css";

function DragActions(props) {
  return (
    <div id={props.elementDragging ? styles.actionsActive : styles.actionsHidden}>
      <div className={styles.dragActionsButton} action="delete"></div>
      <div className={styles.dragActionsButton} action="add-to-box"></div>
      <div className={styles.dragActionsButton} action="add-to-subsection"></div>
    </div>
  )
}

export default DragActions;
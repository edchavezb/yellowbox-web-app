import React, { useState, useEffect } from 'react';

import styles from "./DragActions.module.css";

function DragActions(props) {

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.className = `${styles.dragActionsButton} ${styles.idleColor}`
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.className = `${styles.dragActionsButton} ${styles.dragOverColor}`
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const data = JSON.parse(e.dataTransfer.getData("data"))
  }

  return (
    <div id={props.elementDragging ? styles.actionsActive : styles.actionsHidden}>
      <div className={`${styles.dragActionsButton} ${styles.idleColor}`} id={styles.delete} action="delete"
        onDragEnter={(e) => handleDragEnter(e)} 
        onDragLeave={(e) => handleDragLeave(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e)}> 
        <img id={styles.deleteImg} src="/icons/delete.svg"></img> 
      </div>
      <div className={`${styles.dragActionsButton} ${styles.idleColor}`} id={styles.addTo} action="add-to"
        onDragEnter={(e) => handleDragEnter(e)} 
        onDragLeave={(e) => handleDragLeave(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e)}> 
        <img id={styles.addToImg} src="/icons/plus.svg"></img> 
      </div>
    </div>
  )
}

export default DragActions;
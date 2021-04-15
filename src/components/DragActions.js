import React, { useState, useEffect } from 'react';

import styles from "./DragActions.module.css";

function DragActions(props) {

  const toggleModal = props.toggleModal

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
    const action = e.currentTarget.getAttribute("action")
    e.currentTarget.className = `${styles.dragActionsButton} ${styles.idleColor}`
    toggleModal({visible: true, type: action, boxId: props.boxId, itemData: data, page: props.page})
  }

  return (
    <div id={props.elementDragging ? styles.actionsActive : styles.actionsHidden}>
      {props.page === "box" ?
        <div className={`${styles.dragActionsButton} ${styles.idleColor}`} id={styles.delete} action="Delete Item"
          onDragEnter={(e) => handleDragEnter(e)} 
          onDragLeave={(e) => handleDragLeave(e)}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e)}> 
          <img id={styles.deleteImg} alt="Delete item" src="/icons/delete.svg"></img> 
        </div>
        : ""
      }
      <div className={`${styles.dragActionsButton} ${styles.idleColor}`} id={styles.addTo} action="Add To"
        onDragEnter={(e) => handleDragEnter(e)} 
        onDragLeave={(e) => handleDragLeave(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e)}> 
        <img id={styles.addToImg} alt="Add item" src="/icons/plus.svg"></img> 
      </div>
    </div>
  )
}

export default DragActions;
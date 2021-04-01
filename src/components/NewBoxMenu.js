import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styles from "./NewBoxMenu.module.css";

function NewBoxMenu(props) {

  const toggleModal = props.toggleModal;
  const dispatch = props.dispatch;

  const [boxDetails, setBoxDetails] = useState({boxName: "", boxDesc: "", avail: "public"})

  const handleCreateBox = () => {
    const highestId = parseInt(props.userBoxes[props.userBoxes.length - 1].id)
    const newId = (highestId + 1).toString()
    const newBox = {
      id: newId,
      name: boxDetails.boxName,
      description: boxDetails.boxDesc,
      available: boxDetails.avail,
      artists: [],
      albums: [],
      tracks: []
    }
    dispatch({ type: "ADD_BOX", payload: { newBox: newBox } })
    toggleModal({ visible: false, type: "", boxId:"" })
  }

  return (
    <div id={styles.modalBody}>
      <form id={styles.newBoxForm}>
        <label className={styles.formElement} htmlFor="box-name"> Name </label>
        <input className={styles.formElement} type="text" name="box-name" id={styles.boxName}
          onChange={(e) => setBoxDetails(state => ({ ...state, boxName: e.target.value.trim() }))} />
        <label className={styles.formElement} htmlFor="box-description"> Description </label>
        <textarea className={styles.formElement} name="box-description" id={styles.boxDesc} rows="3" resize="none"
          onChange={(e) => setBoxDetails(state => ({ ...state, boxDesc: e.target.value.trim() }))} />
      </form>
      <div id={styles.modalFooter}>
        <button onClick={() => handleCreateBox()}> Create </button>
      </div>
    </div>
  )
}

export default NewBoxMenu;
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styles from "./Modal.module.css";

function Modal(props) {

  const toggleModal = props.toggle;
  const dispatch = props.dispatch;

  const [boxDetails, setBoxDetails] = useState({boxName: "", boxDesc: "", avail: "public"})
  
  let modalBody = ""
  let buttonText = ""
  let action = null

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
    dispatch({type: "ADD_BOX", payload: {newBox: newBox}})
    toggleModal({visible: false, type:""})
  }

  switch(props.type){
    case "New Box" :
      modalBody = 
      <div id={styles.modalBody}>
        <form id={styles.newBoxForm}>
          <label className={styles.formElement} htmlFor="box-name"> Name </label>
          <input className={styles.formElement} type="text" name="box-name" id={styles.boxName} 
            onChange={(e) => setBoxDetails(state => ({ ...state, boxName: e.target.value.trim()}))}/>
          <label className={styles.formElement} htmlFor="box-description"> Description </label>
          <textarea className={styles.formElement} name="box-description" id={styles.boxDesc} rows="3" resize="none" 
            onChange={(e) => setBoxDetails(state => ({ ...state, boxDesc: e.target.value.trim()}))}/>
        </form>
      </div>
      buttonText = "Create"
      action = handleCreateBox
    break;
  }

  if (props.visible === true){
    return (
      <div id={styles.modalDiv}> 
        <div id={styles.modalPanel}>
          <div id={styles.modalHeader}>
            <div id={styles.modalTitle}> {props.type} </div>
            <div id={styles.closeModal} onClick={() => toggleModal({visible: false, type:""})}>
              <img id={styles.closeIcon} src="/icons/close.svg"/>
            </div>
          </div>
          {modalBody}
          <div id={styles.modalFooter}>
            <button onClick={() => action()}> {buttonText} </button>
          </div>
        </div>
      </div>
    );
  } else return ""
}

export default Modal;
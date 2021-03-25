import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styles from "./Modal.module.css";

function Modal(props) {

  const hideModal = props.toggle

  return (
    <div id={styles.modalDiv}> 
      <div id={styles.modalPanel}>
        <div id={styles.modalHeader}>
          <div id={styles.modalTitle}> {props.type} </div>
          <div id={styles.closeModal} onClick={() => hideModal({visible: false, type:""})}>
            <img id={styles.closeIcon} src="/icons/close.svg"/>
          </div>
        </div>
        <div id={styles.modalBody}>
        </div>
      </div>
    </div>
  );

  
}

export default Modal;
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styles from "./Modal.module.css";
import SortingMenu from "./menus/SortingMenu";
import NewBoxMenu from "./menus/NewBoxMenu";
import DeletePrompt from "./menus/DeletePrompt";
import AddToMenu from "./menus/AddToMenu";

function Modal(props) {

  const userBoxes = props.userBoxes
  const toggleModal = props.toggleModal;
  const dispatch = props.dispatch;
  const boxId = props.boxId;

  let modalBody = ""

  switch(props.type){
    case "New Box" :
      modalBody = <NewBoxMenu toggleModal={toggleModal} dispatch={dispatch} userBoxes={userBoxes} />
    break;
    case "Sorting Options" :
      modalBody = <SortingMenu toggleModal={toggleModal} dispatch={dispatch} userBoxes={userBoxes} boxId={boxId} />
    break;
    case "Delete Item" :
      modalBody = <DeletePrompt toggleModal={toggleModal} dispatch={dispatch} userBoxes={userBoxes} boxId={boxId} itemData={props.itemData} />
    break;
    case "Add To" :
      modalBody = <AddToMenu toggleModal={toggleModal} dispatch={dispatch} userBoxes={userBoxes} boxId={boxId} itemData={props.itemData} page={props.page}/>
    break;
    default:
  }

  if (props.visible === true){
    return (
      <div id={styles.modalDiv}> 
        <div id={styles.modalPanel}>
          <div id={styles.modalHeader}>
            <div id={styles.modalTitle}> {props.type} </div>
            <div id={styles.closeModal} onClick={() => toggleModal({visible: false, type:"", boxId:"", itemData: ""})}>
              <img id={styles.closeIcon} alt="Close modal" src="/icons/close.svg"/>
            </div>
          </div>
          {modalBody}
        </div>
      </div>
    );
  } else return ""
}

export default Modal;
import { Dispatch, SetStateAction, useState } from 'react';
import { ModalState, UpdateBoxPayload, UserBox } from '../../interfaces';

import styles from "./NewBoxMenu.module.css";

enum UpdateBoxTypes {
  UPDATE_BOX = 'UPDATE_BOX',
  NEW_BOX = 'NEW_BOX',
  DELETE_BOX = 'DELETE_BOX',
}

interface IProps {
  userBoxes: UserBox[]
  dispatch: React.Dispatch<{
    type: UpdateBoxTypes;
    payload: UpdateBoxPayload;
  }>
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function NewBoxMenu({userBoxes, toggleModal, dispatch}: IProps) {

  const [boxDetails, setBoxDetails] = useState({boxName: "", boxDesc: "", public: true})

  const newUserBox = () => {
    const highestId = parseInt(userBoxes[userBoxes.length - 1].id)
    const newId = (highestId + 1).toString()

    const newBox: UserBox = {
      id: newId,
      name: boxDetails.boxName,
      description: boxDetails.boxDesc,
      creator: "", //TODO: This must be the user ID
      public: boxDetails.public,
      artists: [],
      albums: [],
      tracks: [],
      playlists: [],
      sectionSorting: {
        artists: {
          primarySorting: "custom",
          secondarySorting: "none",
          view: "grid",
          ascendingOrder: false,
          displaySubSections: false
        },
        albums: {
          primarySorting: "custom",
          secondarySorting: "none",
          view: "grid",
          ascendingOrder: false,
          displaySubSections: false
        },
        tracks: {
          primarySorting: "custom",
          secondarySorting: "none",
          view: "grid",
          ascendingOrder: false,
          displaySubSections: false
        },
        playlists: {
          primarySorting: "custom",
          secondarySorting: "none",
          view: "grid",
          ascendingOrder: false,
          displaySubSections: false
        }
      },
      sectionVisibility: {
        artists: true,
        albums: true, 
        tracks: true,
        playlists: true
      },
      subSections : []
    }

    return newBox;
  }

  const handleSaveNewBox = () => {
    dispatch({ type: UpdateBoxTypes["NEW_BOX"], payload: { updatedBox: newUserBox() } })
    toggleModal({ visible: false, type: "", boxId:"", page: ""})
  }

  return (
    <div id={styles.modalBody}>

      <form id={styles.newBoxForm}>
        <label className={styles.formElement} htmlFor="box-name"> Name </label>
        <input className={styles.formElement} type="text" name="box-name" id={styles.boxName}
          onChange={(e) => setBoxDetails(state => ({ ...state, boxName: e.target.value.trim() }))} 
        />

        <label className={styles.formElement} htmlFor="box-description"> Description </label>
        <textarea className={styles.formElement} name="box-description" id={styles.boxDesc} rows={3}
          onChange={(e) => setBoxDetails(state => ({ ...state, boxDesc: e.target.value.trim() }))} 
        />
      </form>

      <div id={styles.modalFooter}>
        <button onClick={() => handleSaveNewBox()}> Create </button>
      </div>

    </div>
  )
}

export default NewBoxMenu;
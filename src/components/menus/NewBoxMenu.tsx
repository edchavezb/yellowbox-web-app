import { Dispatch, SetStateAction, useState } from 'react';
import { createUserBox } from '../../core/api/userboxes';
import { ModalState, UpdateBoxPayload, UserBox, YellowboxUser } from '../../core/types/interfaces';

import styles from "./NewBoxMenu.module.css";

enum UserBoxesActionTypes {
  UPDATE_BOX = 'UPDATE_BOX',
  NEW_BOX = 'NEW_BOX',
  DELETE_BOX = 'DELETE_BOX',
}

interface IProps {
  user: YellowboxUser
  userBoxes: UserBox[]
  dispatch: React.Dispatch<{
    type: UserBoxesActionTypes;
    payload: UpdateBoxPayload;
  }>
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function NewBoxMenu({user, userBoxes, toggleModal, dispatch}: IProps) {

  const [boxDetails, setBoxDetails] = useState({boxName: "", boxDesc: "", public: true})

  const newUserBox = async () => {
    const blankBox: Omit<UserBox, '_id'> = {
      name: boxDetails.boxName,
      description: boxDetails.boxDesc,
      creator: user._id,
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
    const newBox = await createUserBox(blankBox)
    console.log(newBox)
    return newBox;
  }

  const handleSaveNewBox = async () => {
    const boxPayload = await newUserBox();
    console.log(boxPayload)
    dispatch({ type: UserBoxesActionTypes["NEW_BOX"], payload: { updatedBox: boxPayload } })
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
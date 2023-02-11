import { createUserBox } from 'core/features/userBoxes/userBoxesSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useState } from 'react';
import { createUserBoxApi } from 'core/api/userboxes';
import { UserBox } from 'core/types/interfaces';

import styles from "./NewBoxMenu.module.css";
import { setModalState } from 'core/features/modal/modalSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';

function NewBoxMenu() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userData.authenticatedUser)
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
          displaySubSections: false,
          displayGrouping: false
        },
        albums: {
          primarySorting: "custom",
          secondarySorting: "none",
          view: "grid",
          ascendingOrder: false,
          displaySubSections: false,
          displayGrouping: false
        },
        tracks: {
          primarySorting: "custom",
          secondarySorting: "none",
          view: "grid",
          ascendingOrder: false,
          displaySubSections: false,
          displayGrouping: false
        },
        playlists: {
          primarySorting: "custom",
          secondarySorting: "none",
          view: "grid",
          ascendingOrder: false,
          displaySubSections: false,
          displayGrouping: false
        }
      },
      sectionVisibility: {
        artists: true,
        albums: true, 
        tracks: true,
        playlists: true
      },
      subSections : [],
      notes: []
    }
    const newBox = await createUserBoxApi(blankBox)
    return newBox;
  }

  const handleSaveNewBox = async () => {
    const boxPayload = await newUserBox();
    dispatch(createUserBox(boxPayload!))
    dispatch(setModalState({visible: false, type:"", boxId:"", page: "", itemData: undefined}))
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
        <button disabled={!boxDetails.boxName} onClick={() => handleSaveNewBox()}> Create </button>
      </div>
    </div>
  )
}

export default NewBoxMenu;
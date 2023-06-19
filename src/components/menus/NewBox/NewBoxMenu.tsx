import { createUserBoxThunk } from 'core/features/userBoxes/userBoxesSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useState } from 'react';
import { UserBox } from 'core/types/interfaces';

import styles from "./NewBoxMenu.module.css";
import { setModalState } from 'core/features/modal/modalSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { updateCurrentBoxDetailThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';

interface NewBoxMenuProps {
  editMode: boolean
}

function NewBoxMenu({ editMode }: NewBoxMenuProps) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box)
  const user = useAppSelector(state => state.userData.authenticatedUser)
  const [boxDetails, setBoxDetails] = useState(
    editMode ?
      { boxName: currentBox.name, boxDesc: currentBox.description, public: currentBox.public }
      :
      { boxName: "", boxDesc: "", public: true }
  )

  const newUserBox = () => {
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
      subSections: [],
      notes: []
    }
    return blankBox;
  }

  const handleSaveNewBox = async () => {
    dispatch(createUserBoxThunk(newUserBox()))
  }

  const handleUpdateBox = async (updatedBox: UserBox) => {
    dispatch(updateCurrentBoxDetailThunk(currentBox._id, updatedBox))
  }

  const handleSubmitBtnClick = async () => {
    if (editMode) {
      const {boxName, boxDesc} = boxDetails
      const updatedBox = {...currentBox, name: boxName, description: boxDesc, public: boxDetails.public}
      await handleUpdateBox(updatedBox)
    }
    else {
      await handleSaveNewBox()
    }
    dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))
  }

  return (
    <div id={styles.modalBody}>
      <form id={styles.newBoxForm}>
        <label className={styles.formElement} htmlFor="box-name"> Name </label>
        <input className={styles.formElement} type="text" name="box-name" id={styles.boxName}
          value={boxDetails.boxName}
          onChange={(e) => setBoxDetails(state => ({ ...state, boxName: e.target.value }))}
        />
        <label className={styles.formElement} htmlFor="box-description"> Description </label>
        <textarea className={styles.formElement} name="box-description" id={styles.boxDesc} rows={3}
          value={boxDetails.boxDesc}
          onChange={(e) => setBoxDetails(state => ({ ...state, boxDesc: e.target.value }))}
        />
        <div className={styles.formElement}>
          <input type={'checkbox'} name="public-toggle" checked={boxDetails.public}
            onChange={(e) => setBoxDetails(state => ({ ...state, public: e.target.checked }))} />
          <label className={styles.formElement} htmlFor="public-toggle"> Make this box public &#x24D8; </label>
        </div>
      </form>
      <div id={styles.modalFooter}>
        <button disabled={!boxDetails.boxName} onClick={handleSubmitBtnClick}>
          {editMode ? 'Save Changes' : 'Create'}
        </button>
      </div>
    </div>
  )
}

export default NewBoxMenu;
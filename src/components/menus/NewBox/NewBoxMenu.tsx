import { createUserBoxThunk } from 'core/features/userBoxes/userBoxesSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useState } from 'react';
import { UserBox } from 'core/types/interfaces';
import styles from "./NewBoxMenu.module.css";
import { setModalState } from 'core/features/modal/modalSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { updateCurrentBoxDetailThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';

interface NewBoxMenuProps {
  action: 'New Box' | 'Edit Box' | 'Clone Box'
}

function NewBoxMenu({ action }: NewBoxMenuProps) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box)
  const user = useAppSelector(state => state.userData.authenticatedUser)
  const [boxDetails, setBoxDetails] = useState(
    action !== "New Box" ?
      { 
        boxName: `${currentBox.name}${action === "Clone Box" ? " - Copy" : ""}`, 
        boxDesc: currentBox.description, 
        boxPublic: currentBox.public
      }
      :
      { boxName: "", boxDesc: "", boxPublic: true }
  )

  const newUserBox = () => {
    const blankBox: Omit<UserBox, '_id'> = {
      name: boxDetails.boxName,
      description: boxDetails.boxDesc,
      creator: user._id,
      public: boxDetails.boxPublic,
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

  const getClonedBoxData = () => {
    const {_id , ...currentBoxNoId} = currentBox;
    const clonedBox: Omit<UserBox, '_id'> = {
      ...currentBoxNoId,
      name: boxDetails.boxName,
      description: boxDetails.boxDesc,
      creator: user._id,
      public: boxDetails.boxPublic,
      notes: []
    }
    return clonedBox;
  }

  const getButtonText = () => {
    if (action === "New Box") {
      return "Create"
    }
    else if (action === "Edit Box") {
      return "Save changes"
    }
    else if (action === "Clone Box") {
      return "Clone to your library"
    }
  }

  const handleSaveNewBox = async () => {
    dispatch(createUserBoxThunk(newUserBox()))
  }

  const handleCloneBox = async () => {
    dispatch(createUserBoxThunk(getClonedBoxData()))
  }

  const handleUpdateBox = async () => {
    const {boxName, boxDesc, boxPublic} = boxDetails;
    dispatch(updateCurrentBoxDetailThunk(currentBox._id, boxName, boxDesc, boxPublic))
  }

  const handleSubmitBtnClick = async () => {
    if (action === "Edit Box") {
      handleUpdateBox()
    }
    else if (action === "Clone Box") {
      handleCloneBox()
    }
    else {
      handleSaveNewBox()
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
          <input type={'checkbox'} name="public-toggle" checked={boxDetails.boxPublic}
            onChange={(e) => setBoxDetails(state => ({ ...state, boxPublic: e.target.checked }))} />
          <label className={styles.formElement} htmlFor="public-toggle"> Make this box public &#x24D8; </label>
        </div>
      </form>
      <div id={styles.modalFooter}>
        <button disabled={!boxDetails.boxName} onClick={handleSubmitBtnClick}>
          {getButtonText()}
        </button>
      </div>
    </div>
  )
}

export default NewBoxMenu;
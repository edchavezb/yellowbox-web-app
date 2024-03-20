import { setModalState } from 'core/features/modal/modalSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { addBoxToFolderThunk } from 'core/features/userFolders/userFoldersSlice';
import styles from "./AddToFolderMenu.module.css";
import AppButton from 'components/styled/AppButton/AppButton';

interface IProps {
  page: string
  boxId: string
}

function AddToFolderMenu({ page, boxId}: IProps) {
  const dispatch = useAppDispatch();
  const userFolders = useAppSelector(state => state.userFoldersData.folders)
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const boxName = userBoxes.find(box => box.boxId === boxId)?.boxName
  const [targetFolder, setTargetFolder] = useState(userFolders[0]._id)

  const handleAddItem = () => {
    try {
      dispatch(addBoxToFolderThunk(targetFolder, boxId, boxName!))
    } catch {
      console.log('Could not add item to folder')
    }
    dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <label htmlFor="add-type"> Add this item to </label>
        <select name="folder-select" defaultValue={userFolders[0]._id} onChange={(e) => setTargetFolder(e.target.value)}>
          {userFolders.map(folder => {
            return (<option key={folder._id} value={folder._id}> {folder.name} </option>)
          })}
        </select>
      </div>
      <div id={styles.modalFooter}>
        <AppButton onClick={() => handleAddItem()} text={"Add item"} />
      </div>
    </div>
  )
}

export default AddToFolderMenu;
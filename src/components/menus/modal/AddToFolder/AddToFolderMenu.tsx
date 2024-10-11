import { setModalState } from 'core/features/modal/modalSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { addBoxToFolderThunk } from 'core/features/userFolders/userFoldersSlice';
import styles from "./AddToFolderMenu.module.css";
import AppButton from 'components/styled/AppButton/AppButton';
import { FormControl, FormLabel } from '@chakra-ui/react';
import AppSelect from 'components/styled/AppSelect/AppSelect';

interface IProps {
  page: string
  boxId: string
}

function AddToFolderMenu({ page, boxId }: IProps) {
  const dispatch = useAppDispatch();
  const userFolders = useAppSelector(state => state.userFoldersData.folders)
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const boxName = userBoxes.find(box => box.boxId === boxId)?.name
  const [targetFolder, setTargetFolder] = useState(userFolders[0].folderId)

  const handleAddItem = () => {
    const highestFolderPosition = Math.max(...(userFolders.find(folder => folder.folderId === targetFolder)?.boxes.map(box => box.folderPosition!) || []))
    try {
      dispatch(addBoxToFolderThunk(targetFolder, boxId, boxName!, highestFolderPosition + 1))
    } catch {
      console.log('Could not add item to folder')
    }
    dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <FormControl display={"inline-flex"} gap={"8px"} maxWidth={"fit-content"} alignItems={"center"} marginBottom={"10px"}>
          <FormLabel margin={"0px"}>Select a folder to add this box to: </FormLabel>
          <AppSelect
            value={targetFolder}
            onChange={(e) => setTargetFolder(e.target.value)}
          >
            <>
              {userFolders.map(folder => {
                return (<option key={folder.folderId} value={folder.folderId}> {folder.name} </option>)
              })}
            </>
          </AppSelect>
        </FormControl>
      </div>
      <div id={styles.modalFooter}>
        <AppButton onClick={() => handleAddItem()} text={"Add item"} />
      </div>
    </div>
  )
}

export default AddToFolderMenu;
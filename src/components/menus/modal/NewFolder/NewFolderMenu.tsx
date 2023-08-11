import { createUserFolderThunk } from 'core/features/userFolders/userFoldersSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useState } from 'react';
import { UserFolder } from 'core/types/interfaces';
import { setModalState } from 'core/features/modal/modalSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';
import styles from "./NewFolderMenu.module.css";
import { updateCurrentFolderDetailThunk } from 'core/features/currentFolderDetail/currentFolderDetailSlice';

interface NewFolderMenuProps {
  editMode: boolean
}

function NewFolderMenu({ editMode }: NewFolderMenuProps) {
  const dispatch = useAppDispatch();
  const currentFolder = useAppSelector(state => state.currentFolderDetailData.folder)
  const user = useAppSelector(state => state.userData.authenticatedUser)
  const [folderDetails, setFolderDetails] = useState(
    editMode ?
      { folderName: currentFolder.name, folderDesc: currentFolder.description, isPublic: currentFolder.public }
      :
      { folderName: "", folderDesc: "", isPublic: true }
  )

  const newUserFolder = () => {
    const blankFolder: Omit<UserFolder, '_id'> = {
      name: folderDetails.folderName,
      description: folderDetails.folderDesc,
      creator: user._id,
      public: folderDetails.isPublic,
      boxes: []
    }
    return blankFolder;
  }

  const handleSaveNewFolder = async () => {
    dispatch(createUserFolderThunk(newUserFolder()))
  }

  const handleUpdateFolder = async (updatedFolder: UserFolder) => {
    dispatch(updateCurrentFolderDetailThunk(currentFolder._id, updatedFolder))
  }

  const handleSubmitBtnClick = async () => {
    if (editMode) {
      const { folderName, folderDesc, isPublic } = folderDetails
      const updatedBox = { ...currentFolder, name: folderName, description: folderDesc, public: isPublic }
      await handleUpdateFolder(updatedBox)
    }
    else {
      await handleSaveNewFolder()
    }
    dispatch(setModalState({ visible: false, type: "", boxId: "", folderId: "", page: "", itemData: undefined }))
  }

  return (
    <div id={styles.modalBody}>
      <form id={styles.newFolderForm}>
        <label className={styles.formElement} htmlFor="folder-name"> Name </label>
        <input className={styles.formElement} type="text" name="folder-name" id={styles.folderName}
          value={folderDetails.folderName}
          onChange={(e) => setFolderDetails(state => ({ ...state, folderName: e.target.value }))}
        />
        <label className={styles.formElement} htmlFor="folder-description"> Description </label>
        <textarea className={styles.formElement} name="folder-description" id={styles.folderDesc} rows={3}
          value={folderDetails.folderDesc}
          onChange={(e) => setFolderDetails(state => ({ ...state, folderDesc: e.target.value }))}
        />
        <div className={styles.formElement}>
          <input type={'checkbox'} name="public-toggle" checked={folderDetails.isPublic}
            onChange={(e) => setFolderDetails(state => ({ ...state, isPublic: e.target.checked }))} />
          <label className={styles.formElement} htmlFor="public-toggle"> Make this folder public &#x24D8; </label>
        </div>
      </form>
      <div id={styles.modalFooter}>
        <button disabled={!folderDetails.folderName} onClick={handleSubmitBtnClick}>
          {editMode ? 'Save Changes' : 'Create'}
        </button>
      </div>
    </div>
  )
}

export default NewFolderMenu;
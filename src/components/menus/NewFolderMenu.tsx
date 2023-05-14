import { createUserFolderThunk } from 'core/features/userFolders/userFoldersSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useState } from 'react';
import { UserFolder } from 'core/types/interfaces';
import { setModalState } from 'core/features/modal/modalSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';
import styles from "./NewFolderMenu.module.css";

interface NewFolderMenuProps {
  editMode: boolean
}

function NewFolderMenu({ editMode }: NewFolderMenuProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userData.authenticatedUser)
  const [folderDetails, setFolderDetails] = useState(
    { folderName: "", folderDesc: "", public: true }
  )

  const newUserFolder = () => {
    const blankFolder: Omit<UserFolder, '_id'> = {
      name: folderDetails.folderName,
      description: folderDetails.folderDesc,
      creator: user._id,
      public: folderDetails.public,
      boxes: []
    }
    return blankFolder;
  }

  const handleSaveNewFolder = async () => {
    dispatch(createUserFolderThunk(newUserFolder()))
  }

  const handleSubmitBtnClick = async () => {
    await handleSaveNewFolder()
    dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", itemData: undefined }))
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
          <input type={'checkbox'} name="public-toggle" checked={folderDetails.public}
            onChange={(e) => setFolderDetails(state => ({ ...state, public: e.target.checked }))} />
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
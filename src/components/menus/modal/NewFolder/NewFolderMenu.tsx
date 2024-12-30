import { createUserFolderThunk } from 'core/features/userFolders/userFoldersSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useState } from 'react';
import { UserFolder } from 'core/types/interfaces';
import { setModalState } from 'core/features/modal/modalSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';
import styles from "./NewFolderMenu.module.css";
import { updateCurrentFolderDetailThunk } from 'core/features/currentFolderDetail/currentFolderDetailSlice';
import FormInput from 'components/styled/FormInput/FormInput';
import FormTextarea from 'components/styled/FormTextarea/FormTextarea';
import AppButton from 'components/styled/AppButton/AppButton';

interface NewFolderMenuProps {
  editMode: boolean
}

function NewFolderMenu({ editMode }: NewFolderMenuProps) {
  const dispatch = useAppDispatch();
  const currentFolder = useAppSelector(state => state.currentFolderDetailData.folder)
  const user = useAppSelector(state => state.userData.authenticatedUser)
  const [folderDetails, setFolderDetails] = useState(
    editMode ?
      { folderName: currentFolder.name, folderDesc: currentFolder.description, isPublic: currentFolder.isPublic }
      :
      { folderName: "", folderDesc: "", isPublic: true }
  )

  const newUserFolder = () => {
    const blankFolder: Omit<UserFolder, 'folderId' | 'boxes'> = {
      name: folderDetails.folderName,
      description: folderDetails.folderDesc,
      creator: user.userId,
      isPublic: folderDetails.isPublic
    }
    return blankFolder;
  }

  const handleSaveNewFolder = async () => {
    dispatch(createUserFolderThunk(newUserFolder()))
  }

  const handleUpdateFolder = async (name: string, description: string, isPublic: boolean) => {
    dispatch(updateCurrentFolderDetailThunk(currentFolder.folderId, name, description, isPublic))
  }

  const handleSubmitBtnClick = async () => {
    if (editMode) {
      const { folderName, folderDesc, isPublic } = folderDetails
      await handleUpdateFolder(folderName, folderDesc, isPublic)
    }
    else {
      await handleSaveNewFolder()
    }
    dispatch(setModalState({ visible: false, type: "", boxId: "", folderId: "", page: "", itemData: undefined }))
  }

  return (
    <div id={styles.modalBody}>
      <form id={styles.newFolderForm}>
        <FormInput
          label={"Name"}
          value={folderDetails.folderName}
          onChange={(e) => setFolderDetails(state => ({ ...state, folderName: e.target.value }))}
        />
        <FormTextarea
          label={"Description"}
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
        <AppButton text={editMode ? 'Save Changes' : 'Create'} disabled={!folderDetails.folderName} onClick={handleSubmitBtnClick} />
      </div>
    </div>
  )
}

export default NewFolderMenu;
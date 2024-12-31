import { cloneUserBoxThunk, createUserBoxThunk } from 'core/features/userBoxes/userBoxesSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useState } from 'react';
import { BoxCreateDTO, UserBox } from 'core/types/interfaces';
import styles from "./NewBoxMenu.module.css";
import { setModalState } from 'core/features/modal/modalSlice';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { updateCurrentBoxDetailThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import FormInput from 'components/styled/FormInput/FormInput';
import FormTextarea from 'components/styled/FormTextarea/FormTextarea';
import AppButton from 'components/styled/AppButton/AppButton';

interface NewBoxMenuProps {
  action: 'New Box' | 'Edit Box' | 'Clone Box'
}

function NewBoxMenu({ action }: NewBoxMenuProps) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box)
  const user = useAppSelector(state => state.userData.authenticatedUser)
  const userDashboardBoxes = useAppSelector(state => state.userBoxesData.dashboardBoxes);
  const [boxDetails, setBoxDetails] = useState(
    action !== "New Box" ?
      {
        boxName: `${currentBox.name}${action === "Clone Box" ? " - Copy" : ""}`,
        boxDesc: currentBox.description,
        boxPublic: currentBox.isPublic
      }
      :
      { boxName: "", boxDesc: "", boxPublic: true }
  )

  const newUserBox = () => {
    const maxBoxPosition = Math.max(...userDashboardBoxes.map(box => box.position!)) ?? 0;
    console.log(maxBoxPosition)
    const blankBox: BoxCreateDTO = {
      name: boxDetails.boxName,
      description: boxDetails.boxDesc,
      creatorId: user.userId,
      isPublic: boxDetails.boxPublic,
      position: maxBoxPosition + 1
    }
    return blankBox;
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
    return "Button"
  }

  const handleSaveNewBox = async () => {
    dispatch(createUserBoxThunk(newUserBox()))
  }

  const handleCloneBox = async () => {
    const { boxName, boxDesc, boxPublic } = boxDetails;
    dispatch(cloneUserBoxThunk(currentBox.boxId, boxName, boxDesc, boxPublic, user.userId))
  }

  const handleUpdateBox = async () => {
    const { boxName, boxDesc, boxPublic } = boxDetails;
    dispatch(updateCurrentBoxDetailThunk(currentBox.boxId, boxName, boxDesc, boxPublic))
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
        <FormInput
          label={"Name"}
          value={boxDetails.boxName}
          onChange={(e) => setBoxDetails(state => ({ ...state, boxName: e.target.value }))}
        />
        <FormTextarea
          label={"Description"}
          value={boxDetails.boxDesc}
          onChange={(e) => setBoxDetails(state => ({ ...state, boxDesc: e.target.value }))}
        />
        <div className={styles.formElement}>
          <input type={'checkbox'} name="isPublic-toggle" checked={boxDetails.boxPublic}
            onChange={(e) => setBoxDetails(state => ({ ...state, boxPublic: e.target.checked }))} />
          <label className={styles.formElement} htmlFor="isPublic-toggle"> Make this box public &#x24D8; </label>
        </div>
      </form>
      <div id={styles.modalFooter}>
        <AppButton text={getButtonText()} disabled={!boxDetails.boxName} onClick={handleSubmitBtnClick} />
      </div>
    </div>
  )
}

export default NewBoxMenu;
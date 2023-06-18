import { ModalType, setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import styles from "./BoxMenu.module.css";
import { removeBoxFromFolderThunk } from "core/features/userFolders/userFoldersSlice";

interface BoxMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const BoxMenu = ({ setIsOpen }: BoxMenuProps) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const boxDetailViewing = useAppSelector(state => state.currentBoxDetailData.isUserViewing)
  const { _id: boxId, name: boxName } = useAppSelector(state => state.currentBoxDetailData.box)
  const userFolders = useAppSelector(state => state.userFoldersData.folders)
  const containingFolder = userFolders.find(folder => folder.boxes.map(dashboardBox => dashboardBox.boxId).includes(boxId));
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const isOwner = !!userBoxes.find(box => box.boxId === boxId);
  const { menuItemsList, menuItem } = styles;

  const handleCloneBox = () => {
    //TODO: Implement clone box
  }

  const handleOpenModal = (modalType: ModalType) => {
    dispatch(setModalState({
      visible: true, type: modalType, page: "", boxId, itemData: undefined
    }))
    setIsOpen(false);
  }

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href);
  }

  const handleRemoveFromFolder = () => {
    if (containingFolder) {
      dispatch(removeBoxFromFolderThunk(containingFolder._id, boxId, boxName));
    }
  }

  return (
    <div className={menuItemsList}>
      {
        (boxDetailViewing && isOwner) &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Edit Box")}>
          Edit box details
        </div>
      }
      {
        (boxDetailViewing && isOwner) &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Delete Box")}>
          Delete this box
        </div>
      }
      {
        isLoggedIn &&
        <div
          className={menuItem}
          onClick={() => handleCloneBox()}>
          Clone this box
        </div>
      }
      <div
        className={menuItem}
        onClick={() => handleCopyURL()}>
        Copy box URL
      </div>
      {
        (boxDetailViewing && isOwner && !containingFolder) &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Add To Folder")}>
          Add to folder
        </div>
      }
      {
        (boxDetailViewing && isOwner && containingFolder) &&
        <div
          className={menuItem}
          onClick={() => handleRemoveFromFolder()}>
          {`Remove from ${containingFolder.name}`}
        </div>
      }
    </div>
  );
};

export default BoxMenu;
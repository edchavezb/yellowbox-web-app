import { ModalType, setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import styles from "./BoxMenu.module.css";
import { removeBoxFromFolderThunk } from "core/features/userFolders/userFoldersSlice";

interface BoxMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOwner?: boolean
}

const BoxMenu = ({ setIsOpen, isOwner }: BoxMenuProps) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const boxDetailViewing = useAppSelector(state => state.currentBoxDetailData.isUserViewing)
  const { boxId, name: boxName, folder: boxFolder } = useAppSelector(state => state.currentBoxDetailData.box)
  const userFolders = useAppSelector(state => state.userFoldersData.folders)
  const isInFolder = !!boxFolder;
  const { menuItemsList, menuItem } = styles;

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
    if (isInFolder) {
      const highestFolderPosition = Math.max(...userFolders.find(folder => folder.folderId === boxFolder.folderId)!.boxes.map(box => box.folderPosition!))
      dispatch(removeBoxFromFolderThunk(boxFolder.folderId, boxId, boxName, highestFolderPosition + 1));
    }
  }

  return (
    <div className={menuItemsList}>
      {
        boxDetailViewing &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Sorting Options")}>
          Sorting options
        </div>
      }
      {
        (boxDetailViewing && isOwner) &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Box Subsections")}>
          Manage sections
        </div>
      }
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
          onClick={() => handleOpenModal("Clone Box")}>
          Clone this box
        </div>
      }
      <div
        className={menuItem}
        onClick={() => handleCopyURL()}>
        Copy box URL
      </div>
      {
        (boxDetailViewing && isOwner && !isInFolder) &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Add To Folder")}>
          Add to folder
        </div>
      }
      {
        (boxDetailViewing && isOwner && isInFolder) &&
        <div
          className={menuItem}
          onClick={() => handleRemoveFromFolder()}>
          {`Remove from ${boxFolder.name}`}
        </div>
      }
    </div>
  );
};

export default BoxMenu;
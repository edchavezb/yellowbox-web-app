import { ModalType, setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import styles from "./FolderMenu.module.css";

interface BoxMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const FolderMenu = ({ setIsOpen }: BoxMenuProps) => {
  const dispatch = useAppDispatch();
  const { _id: folderId } = useAppSelector(state => state.currentFolderDetailData.folder)
  const userFolders = useAppSelector(state => state.userFoldersData.folders)
  const isOwner = userFolders.some(folder => folder._id === folderId);
  const { menuItemsList, menuItem } = styles;

  const handleOpenModal = (modalType: ModalType) => {
    dispatch(setModalState({
      visible: true, type: modalType, page: "", folderId, itemData: undefined
    }))
    setIsOpen(false);
  }

  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className={menuItemsList}>
      {
        isOwner &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Edit Folder")}>
          Edit folder details
        </div>
      }
      {
        isOwner &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Delete Folder")}>
          Delete this folder
        </div>
      }
      <div
        className={menuItem}
        onClick={() => handleCopyURL()}>
        Copy folder URL
      </div>
    </div>
  );
};

export default FolderMenu;
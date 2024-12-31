import { ModalType, setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import styles from "./AddButtonMenu.module.css";

interface BoxMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddButtonMenu = ({ setIsOpen }: BoxMenuProps) => {
  const dispatch = useAppDispatch();
  const { boxId } = useAppSelector(state => state.currentBoxDetailData.box)
  const { menuItemsList, menuItem } = styles;

  const handleOpenModal = (modalType: ModalType) => {
    dispatch(setModalState({
      visible: true, type: modalType, page: "", boxId, itemData: undefined
    }))
    setIsOpen(false);
  }

  return (
    <div className={menuItemsList}>
      <div
        className={menuItem}
        onClick={() => handleOpenModal('New Box')}>
        New box
      </div>
      <div
        className={menuItem}
        onClick={() => handleOpenModal('New Folder')}>
        New folder
      </div>
    </div>
  );
};

export default AddButtonMenu;
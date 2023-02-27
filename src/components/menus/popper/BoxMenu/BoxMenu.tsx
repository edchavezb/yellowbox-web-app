import { ModalType, setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import styles from "./BoxMenu.module.css";

interface BoxMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const BoxMenu = ({setIsOpen}: BoxMenuProps) => {
  const dispatch = useAppDispatch();
  const boxDetailViewing = useAppSelector(state => state.currentBoxDetailData.isUserViewing)
  const { _id: boxId } = useAppSelector(state => state.currentBoxDetailData.box)
  const userBoxes = useAppSelector(state => state.userBoxesData.boxes)
  const isOwner = !!userBoxes.find(box => box._id === boxId);
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
      <div 
        className={menuItem}
        onClick={() => handleCloneBox()}>
        Clone this box
      </div>
      <div 
        className={menuItem}
        onClick={() => handleCopyURL()}>
        Copy box URL
      </div>
    </div>
  );
};

export default BoxMenu;
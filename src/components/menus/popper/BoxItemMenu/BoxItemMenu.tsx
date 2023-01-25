import { ModalType, setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { Artist, Album, Track, Playlist } from "core/types/interfaces";
import styles from "./BoxItemMenu.module.css";

interface BoxItemMenuProps {
  itemData: Artist | Album | Track | Playlist;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const BoxItemMenu = ({itemData, setIsOpen}: BoxItemMenuProps) => {
  const dispatch = useAppDispatch();
  const boxDetailViewing = useAppSelector(state => state.currentBoxDetailData.isUserViewing)
  const { _id: boxId, notes } = useAppSelector(state => state.currentBoxDetailData.box)
  const userBoxes = useAppSelector(state => state.userBoxesData.boxes)
  const isOwner = !!userBoxes.find(box => box._id === boxId);
  const { menuItemsList, menuItem } = styles;

  const handleClickItem = (modalType: ModalType) => {
    dispatch(setModalState({
      visible: true, type: modalType, page: "", boxId, itemData
    }))
    setIsOpen(false);
  }

  return (
    <div className={menuItemsList}>
      <div 
        className={menuItem}
        onClick={() => handleClickItem("Add To Box")}>
        Add to box...
      </div>
      { 
        (boxDetailViewing && isOwner) &&
        <div 
          className={menuItem}
          onClick={() => handleClickItem("Add To Subsection")}>
          Add to subsection...
        </div>
      }
      { 
        (boxDetailViewing && isOwner) &&
        <div 
          className={menuItem}
          onClick={() => handleClickItem("Delete Item")}>
          Remove from this box
        </div>
      }
      { 
        (boxDetailViewing && isOwner) &&
        <div 
          className={menuItem}
          onClick={() => handleClickItem("Change Order")}>
          Reorder box items
        </div>
      }
      { 
        (boxDetailViewing && isOwner) &&
        <div 
          className={menuItem}
          onClick={() => handleClickItem("Item Note")}>
          {notes?.some(note => note.itemId === itemData._id) ? 'Edit note' : 'Add note'}
        </div>
      }
    </div>
  );
};

export default BoxItemMenu;
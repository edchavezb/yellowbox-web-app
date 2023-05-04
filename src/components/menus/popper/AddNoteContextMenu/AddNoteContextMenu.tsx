import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { Subsection } from "core/types/interfaces";
import styles from "./AddNoteContextMenu.module.css";
import { addNoteToBoxThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { ItemData } from "core/types/types";

interface AddNoteContextMenuProps {
  item: ItemData
  subSections: Subsection[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNoteContextMenu = ({ item, subSections, setIsOpen }: AddNoteContextMenuProps) => {
  const dispatch = useAppDispatch();
  const { box } = useAppSelector(state => state.currentBoxDetailData)
  const { _id: boxId } = box || {};
  const { menuItemsList, menuItem } = styles;

  const handleAddNoteToSubSection = (subSectionId: string) => {
    dispatch(addNoteToBoxThunk(boxId, item.id, "", subSectionId))
    setIsOpen(false);
  }

  return (
    <div className={menuItemsList}>
      {subSections.map(subSection => {
        return (
          <div className={menuItem} onClick={() => handleAddNoteToSubSection(subSection._id!)}> {subSection.name} </div>
        )
      })}
    </div>
  );
};

export default AddNoteContextMenu;
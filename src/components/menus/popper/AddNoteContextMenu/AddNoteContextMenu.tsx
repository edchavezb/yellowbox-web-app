import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { Subsection } from "core/types/interfaces";
import styles from "./AddNoteContextMenu.module.css";
import { addNoteToBoxThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { ItemData } from "core/types/types";

interface AddNoteContextMenuProps {
  item: ItemData
  subsections: Subsection[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNoteContextMenu = ({ item, subsections, setIsOpen }: AddNoteContextMenuProps) => {
  const dispatch = useAppDispatch();
  const { box } = useAppSelector(state => state.currentBoxDetailData)
  const { boxId } = box || {};
  const { menuItemsList, menuItem } = styles;

  const handleAddNoteToSubSection = (subSectionId: string) => {
    dispatch(addNoteToBoxThunk(boxId, item.itemId!, "", subSectionId))
    setIsOpen(false);
  }

  return (
    <div className={menuItemsList}>
      {subsections.map(subSection => {
        return (
          <div className={menuItem} onClick={() => handleAddNoteToSubSection(subSection.subsectionId!)}> {subSection.name} </div>
        )
      })}
    </div>
  );
};

export default AddNoteContextMenu;
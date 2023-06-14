import { DashboardBox } from "core/types/interfaces";
import styles from "./SidebarBoxList.module.css";
import { useDroppable } from "@dnd-kit/core";
import SidebarBox from "../SidebarBox/SidebarBox";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface DashboardFolderProps {
  boxes: DashboardBox[]
  isDraggingOver: boolean
}

const SidebarBoxList = ({ boxes, isDraggingOver }: DashboardFolderProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'boxList',
  });

  return (
    <div className={isDraggingOver ? styles.boxListHighlighted : styles.boxListWrapper} ref={setNodeRef}>
      <div className={styles.list}>
        <SortableContext
          items={boxes.map(item => item.boxId!)}
          strategy={verticalListSortingStrategy}
          id={'boxList'}
        >
          {boxes.map(box => {
            return (
              <SidebarBox box={box} key={box.boxId} />
            )
          })}
        </SortableContext>
      </div>

    </div>
  )
}

export default SidebarBoxList;
import { UserFolder } from "core/types/interfaces";
import styles from "./SidebarFolder.module.css";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import SidebarBox from "../SidebarBox/SidebarBox";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useHistory } from "react-router-dom";

interface DashboardFolderProps {
  folder: UserFolder;
  isDraggingOver: boolean;
}

const SidebarFolder = ({ folder, isDraggingOver }: DashboardFolderProps) => {
  const history = useHistory();
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const { isOver, setNodeRef } = useDroppable({
    id: folder._id,
  });
  const rotateStyle = { transform: `rotate(${isFolderOpen ? '90' : '0'}deg)` };

  const navigateToFolder = () => {
    history.push(`/folder/${folder._id}`)
  }

  return (
    <div className={ isDraggingOver ? styles.folderWrapperHighlighted : styles.folderWrapper} ref={setNodeRef}>
      <div className={styles.folderLink} id={folder._id} key={folder._id}>
        <img className={styles.folderIcon} src="/icons/folder.svg" alt="folder"></img>
        <div className={styles.folderName} onClick={navigateToFolder}> {folder.name} </div>
        <div className={styles.chevronWrapper} onClick={() => setIsFolderOpen(!isFolderOpen)}>
          <img
            className={styles.chevronIcon}
            style={rotateStyle}
            src="/icons/chevronright.svg"
            alt="expand-collapse">
          </img>
        </div>
      </div>
      {(isFolderOpen && !!folder.boxes.length) && 
          <div className={styles.folderContents}>
            <SortableContext
              items={folder.boxes.map(item => item.boxId!)}
              strategy={verticalListSortingStrategy}
              id={folder._id}
            >
              {folder.boxes.map(box => {
                return (
                  <SidebarBox box={box} key={box.boxId} />
                )
              })}
            </SortableContext>
          </div>
      }
        </div>
  )
}

export default SidebarFolder;
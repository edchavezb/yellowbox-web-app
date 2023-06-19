import { DashboardBox } from "core/types/interfaces"
import { Link, useHistory } from "react-router-dom"
import styles from "./BoxTile.module.css";
import { CSS } from '@dnd-kit/utilities';
import { useAppSortable } from "components/layout/Sidebar/SidebarBox/SidebarBox";

const BoxTile = ({ box }: { box: DashboardBox }) => {
  const history = useHistory();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useAppSortable({
    id: box.boxId,
    data: {
      name: box.boxName
    }
  });

  const draggableStyle = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  const navigateToBox = () => {
    if (!isDragging) {
      history.push(`/box/${box.boxId}`)
    }
  }


  return (
    <div className={styles.folderBoxWrapper} style={draggableStyle} ref={setNodeRef}  >
      <div className={styles.boxSquare} {...attributes} {...listeners} onClick={navigateToBox}>
        <img className={styles.boxIcon} src="/icons/box.svg" alt="box" />
      </div>
      <div className={styles.boxName}>
        <Link to={`/box/${box.boxId}`}>
          {box.boxName}
        </Link>
      </div>
    </div>
  )
}

export default BoxTile;
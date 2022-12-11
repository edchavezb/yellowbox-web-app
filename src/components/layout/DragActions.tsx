import { setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import styles from "./DragActions.module.css";

interface IProps {
	page: string
  boxId?: string
  isOwner?: boolean,
  elementDragging: boolean
}

function DragActions({page, boxId, isOwner, elementDragging}: IProps) {
  const dispatch = useAppDispatch();

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.className = `${styles.dragActionsButton} ${styles.idleColor}`
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.className = `${styles.dragActionsButton} ${styles.dragOverColor}`
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const data = JSON.parse(event.dataTransfer.getData("data"))
    const action = event.currentTarget.getAttribute("data-action")
    event.currentTarget.className = `${styles.dragActionsButton} ${styles.idleColor}`
    dispatch(setModalState({visible: true, type: action as string, boxId: boxId ?? "", itemData: data, page: page}))
  }

  return (
    <div id={elementDragging ? styles.actionsActive : styles.actionsHidden}>
      <span className={styles.actionsTitle}> QUICK ACTIONS </span>
      {page === "box" && isOwner ?
        <div className={`${styles.dragActionsButton} ${styles.idleColor}`} id={styles.delete} data-action="Delete Item"
          onDragEnter={(e) => handleDragEnter(e)} 
          onDragLeave={(e) => handleDragLeave(e)}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e)}> 
          <img id={styles.deleteImg} alt="Delete item" src="/icons/delete.svg"></img> 
        </div>
        : ""
      }
      <div className={`${styles.dragActionsButton} ${styles.idleColor}`} id={styles.addTo} data-action="Add To"
        onDragEnter={(e) => handleDragEnter(e)} 
        onDragLeave={(e) => handleDragLeave(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e)}> 
        <img id={styles.addToImg} alt="Add item" src="/icons/plus.svg"></img> 
      </div>
    </div>
  )
}

export default DragActions;
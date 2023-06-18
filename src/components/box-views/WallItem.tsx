import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Artist } from "../../core/types/interfaces";
import styles from "./WallItem.module.css";
import PopperMenu from "components/menus/popper/PopperMenu";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

interface IProps {
  element: Artist
  setElementDragging: (dragging: boolean) => void
  reorderingMode?: boolean,
  subId?: string
}

function WallItem({ element, setElementDragging, reorderingMode, subId }: IProps) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: element._id! })
  const wallItemRef = useRef(null);
  const { name, type, id } = element;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const draggableStyle = {
    transform: CSS.Translate.toString(transform),
  }

  const handleDrag = (event: React.DragEvent<HTMLDivElement>, element: Artist) => {
    event.dataTransfer.setData("data", JSON.stringify(element))
    setElementDragging(true)
  }

  const handleDragEnd = () => {
    setElementDragging(false)
  }

  return (
    reorderingMode ?
      <div
        className={styles.itemCardReorder}
        ref={setNodeRef}
        style={draggableStyle}
        {...listeners}
        {...attributes}
      >
        <div ref={wallItemRef} className={styles.name}> {name} </div>
      </div>
      :
      <>
        <div
          draggable
          onDragStart={(event) => handleDrag(event, element)}
          onDragEnd={() => handleDragEnd()}
          className={styles.itemCard}
          ref={wallItemRef}
          onClick={() => setIsMenuOpen(true)}
        >
          <div className={styles.name} ref={wallItemRef}> {name} </div>
        </div>
        <PopperMenu referenceRef={wallItemRef} placement={'right'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu itemData={element} setIsOpen={setIsMenuOpen} itemType={type} subId={subId} viewMode="wall" />
        </PopperMenu>
      </>
  )
}

export default WallItem;
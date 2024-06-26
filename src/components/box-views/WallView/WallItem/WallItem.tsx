import { useRef, useState } from "react";
import { Artist } from "core/types/interfaces";
import styles from "./WallItem.module.css";
import PopperMenu from "components/menus/popper/PopperMenu";
import BoxItemMenu from "components/menus/popper/BoxItemMenu/BoxItemMenu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { extractCrucialData, getElementImage } from "core/helpers/itemDataHandlers";
import { updateBoxArtistApi } from "core/api/userboxes/artists";
import { useAppSelector } from "core/hooks/useAppSelector";

interface IProps {
  element: Artist
  itemIndex: number
  setElementDragging: (dragging: boolean) => void
  reorderingMode?: boolean,
  subId?: string
}

function WallItem({ element, itemIndex, setElementDragging, reorderingMode, subId }: IProps) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: element._id!, data: {index: itemIndex} })
  const wallItemRef = useRef(null);
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const spotifyLoginData = useAppSelector(state => state.spotifyLoginData);
  const spotifyToken = spotifyLoginData?.genericToken;
  const { name, type } = element;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [elementImage, setElementImage] = useState(getElementImage(element));
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

  const queryItemIdApi = async (type: string, id: string, token: string) => {
    const response = await fetch(`https://api.spotify.com/v1/${type}s/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      }
    })
    const item = await response.json();
    return item;
  }

  const handleImageError = async () => {
    const itemResponse = await queryItemIdApi(element.type, element.id, spotifyToken!);
    const itemImage = getElementImage(itemResponse);
    setElementImage(itemImage);
    const itemData = extractCrucialData(itemResponse);
    itemData._id = element._id
    updateBoxArtistApi(currentBox._id, itemData._id!, itemData)
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
       <img
          draggable="false"
          className={styles.itemImage}
          alt={name}
          src={elementImage}
          onError={handleImageError}
        />
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
          <img
            draggable="false"
            className={styles.itemImage}
            alt={name}
            src={elementImage}
            onError={handleImageError}
          />
          <div className={styles.name} ref={wallItemRef}> {name} </div>
        </div>
        <PopperMenu referenceRef={wallItemRef} placement={'right'} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <BoxItemMenu itemData={element} itemIndex={itemIndex} setIsOpen={setIsMenuOpen} itemType={type} subId={subId} viewMode="wall" />
        </PopperMenu>
      </>
  )
}

export default WallItem;
import { useState } from 'react';
import { QueueItem } from "core/types/interfaces";
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import styles from "./Queue.module.css";
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import QueueRow from './QueueRow/QueueRow';

interface IProps {
  data: QueueItem[]
  isReorderingMode: boolean
}

function Queue({ data, isReorderingMode }: IProps) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const [elementDragging, setElementDragging] = useState(false)

  const ListHeader = () => {
    return (
      <div className={styles.trackListHeader}>
        <div className={`${styles.headerCentered}`}> # </div>
        <div className={`${styles.headerLeftAlgn}`}> Title </div>
        <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Type </div>
        <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Spotify </div>
        <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Played </div>
      </div>
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    const itemType = data[0].itemData.type;
    // Implement reordering logic here
  }

  return (
    <>
      {
        isReorderingMode ?
          <>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <div className={styles.itemContainer}>
                <ListHeader />
                <SortableContext
                  items={data.map(item => item.queueItemId!)}
                  strategy={verticalListSortingStrategy}
                >
                  {data.map((element, index) => {
                    return (
                      <QueueRow element={element} itemIndex={index} setElementDragging={setElementDragging} reorderingMode={isReorderingMode ? isReorderingMode : false} key={element.queueItemId} />
                    )
                  })}
                </SortableContext>
              </div>
            </DndContext>
          </>
          :
          <div className={styles.itemContainer}>
            <ListHeader />
            {data.map((element, index) => {
              return (
                <QueueRow element={element} itemIndex={index} setElementDragging={setElementDragging} reorderingMode={isReorderingMode ? isReorderingMode : false} key={element.queueItemId} />
              )
            })}
          </div>
      }
    </>
  )
}

export default Queue;
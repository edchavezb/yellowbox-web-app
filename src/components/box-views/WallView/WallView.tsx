import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { reorderBoxItemsThunk, reorderSubsectionItemsThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { Artist } from "core/types/interfaces";
import styles from "./WallView.module.css";
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import WallItem from './WallItem/WallItem';

interface IProps {
  data: Artist[]
  isSubsection?: boolean
  subId?: string
  isReorderingMode?: boolean
}

function WallView({ data, isSubsection, subId, isReorderingMode }: IProps) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const [elementDragging, setElementDragging] = useState(false)

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    const itemType = data[0].type;
    if (isSubsection) {
      dispatch(
        reorderSubsectionItemsThunk(
          currentBox.boxId,
          active.id as string,
          subId!,
          active?.data?.current?.index as number,
          over?.data?.current?.index as number,
        )
      );
    }
    else {
      dispatch(
        reorderBoxItemsThunk(
          currentBox.boxId,
          active?.id as string,
          active?.data?.current?.index as number,
          over?.data?.current?.index as number,
          itemType
        )
      );
    }
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
                <SortableContext
                  items={data.map(item => item.boxItemId!)}
                  strategy={rectSortingStrategy}
                >
                  {data.map((e, index) => {
                    return (
                      <WallItem
                        key={e.boxItemId}
                        element={e}
                        itemIndex={index}
                        setElementDragging={setElementDragging}
                        reorderingMode={isReorderingMode}
                        subId={subId}
                      />
                    )
                  })}
                </SortableContext>
              </div>
            </DndContext>
          </>
          :
          <div className={styles.itemContainer}>
            {data.map((e, index) => {
              return (
                <WallItem
                  key={e.boxItemId}
                  element={e}
                  itemIndex={index}
                  setElementDragging={setElementDragging}
                  reorderingMode={isReorderingMode}
                  subId={subId}
                />
              )
            })}
          </div>
      }
    </>
  )
}

export default WallView;
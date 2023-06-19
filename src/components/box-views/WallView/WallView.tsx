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
  isDefaultSubSection?: boolean
  subId?: string
  isReorderingMode?: boolean
}

function WallView({ data, isDefaultSubSection, subId, isReorderingMode }: IProps) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const [elementDragging, setElementDragging] = useState(false)

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    const itemType = data[0].type;
    if (isDefaultSubSection) {
      dispatch(
        reorderBoxItemsThunk(
          currentBox._id,
          active.id as string,
          over?.id as string,
          itemType
        )
      );
    }
    else {
      dispatch(
        reorderSubsectionItemsThunk(
          currentBox._id,
          active.id as string,
          over?.id as string,
          subId!
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
                  items={data.map(item => item._id!)}
                  strategy={rectSortingStrategy}
                >
                  {data.map((e) => {
                    return (
                      <WallItem
                        key={e.id}
                        element={e}
                        setElementDragging={setElementDragging}
                        reorderingMode={isReorderingMode}
                      />
                    )
                  })}
                </SortableContext>
              </div>
            </DndContext>
          </>
          :
          <div className={styles.itemContainer}>
            {data.map((e) => {
              return (
                <WallItem
                  key={e.id}
                  element={e}
                  setElementDragging={setElementDragging}
                  reorderingMode={isReorderingMode}
                />
              )
            })}
          </div>
      }
    </>
  )
}

export default WallView;
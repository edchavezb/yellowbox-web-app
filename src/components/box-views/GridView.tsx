import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { reorderBoxItemsThunk, reorderSubsectionItemsThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { Artist, Album, Track, Playlist } from "core/types/interfaces";
import GridItem from "./GridItem"
import styles from "./GridView.module.css";
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';

interface IProps<T> {
  data: T[]
  page: string
  boxId?: string
  isOwner?: boolean,
  customSorting?: boolean
  isDefaultSubSection?: boolean
  subId?: string
}

function GridView<T extends Artist | Album | Track | Playlist>({ data, isOwner, page, boxId, customSorting, isDefaultSubSection, subId }: IProps<T>) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const [isReorderingMode, setIsReorderingMode] = useState(false)
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
        isOwner && isReorderingMode ?
          <>
            <button onClick={() => setIsReorderingMode(false)} className={styles.doneButton}> Done Reordering </button>
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
                      <GridItem<T>
                        key={e.id}
                        element={e}
                        setElementDragging={setElementDragging}
                        reorderingMode={isReorderingMode}
                        setIsReordering={setIsReorderingMode}
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
                <GridItem<T>
                  key={e.id}
                  element={e}
                  setElementDragging={setElementDragging}
                  reorderingMode={isReorderingMode}
                  setIsReordering={setIsReorderingMode}
                />
              )
            })}
          </div>
      }
    </>
  )
}

export default GridView;
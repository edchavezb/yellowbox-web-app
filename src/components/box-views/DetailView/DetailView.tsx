import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { reorderBoxItemsThunk, reorderSubsectionItemsThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { Artist, Album, Track, Playlist } from "core/types/interfaces";

import DetailRow from './DetailRow/DetailRow';
import styles from "./DetailView.module.css";

interface IProps<T> {
  data: T[]
  isDefaultSubSection?: boolean
  subId?: string
  isReorderingMode?: boolean
}

function DetailView<T extends Artist | Album | Track | Playlist>({ data, isDefaultSubSection, subId, isReorderingMode }: IProps<T>) {
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
          active?.id as string,
          active?.data?.current?.index as number,
          over?.data?.current?.index as number,
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
                  strategy={verticalListSortingStrategy}
                >
                  {data.map((e) => {
                    return (
                      <DetailRow
                        key={e.id}
                        index={data.indexOf(e)}
                        element={e}
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
            {data.map((e) => {
              return (
                <DetailRow
                  key={e.id}
                  index={data.indexOf(e)}
                  element={e}
                  setElementDragging={setElementDragging}
                  reorderingMode={isReorderingMode ? isReorderingMode : false}
                  subId={subId}
                />
              )
            })}
          </div>
      }
    </>
  )
}

export default DetailView;
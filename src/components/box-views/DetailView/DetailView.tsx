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
  isSubsection?: boolean
  subId?: string
  isReorderingMode?: boolean
}

function DetailView<T extends Artist | Album | Track | Playlist>({ data, isSubsection, subId, isReorderingMode }: IProps<T>) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const { isUserLoggedIn } = useAppSelector(state => state.userData);
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
                  strategy={verticalListSortingStrategy}
                >
                  {data.map((e, index) => {
                    return (
                      <DetailRow
                        key={e.spotifyId}
                        itemIndex={index}
                        element={e as T}
                        setElementDragging={setElementDragging}
                        reorderingMode={isReorderingMode}
                        subId={subId}
                        isUserLoggedIn={!!isUserLoggedIn}
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
                <DetailRow
                  key={e.spotifyId}
                  itemIndex={index}
                  element={e as T}
                  setElementDragging={setElementDragging}
                  reorderingMode={isReorderingMode ? isReorderingMode : false}
                  subId={subId}
                  isUserLoggedIn={!!isUserLoggedIn}
                />
              )
            })}
          </div>
      }
    </>
  )
}

export default DetailView;
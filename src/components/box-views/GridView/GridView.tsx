import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { reorderBoxItemsThunk, reorderSubsectionItemsThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useState } from 'react';
import { Artist, Album, Track, Playlist } from "core/types/interfaces";
import GridItem from "./GridItem/GridItem"
import styles from "./GridView.module.css";
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';

interface IProps<T> {
  data: T[]
  isSubsection?: boolean
  subId?: string
  isReorderingMode?: boolean
  isSearch?: boolean
}

function GridView<T extends Artist | Album | Track | Playlist>({ data, isSubsection, subId, isReorderingMode, isSearch }: IProps<T>) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const [elementDragging, setElementDragging] = useState(false)
  const [imageErrorToken, setImageErrorToken] = useState('')

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
                      <GridItem<T>
                        key={e.spotifyId}
                        element={e as T}
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
                <GridItem<T>
                  key={e.spotifyId}
                  element={e as T}
                  itemIndex={index}
                  setElementDragging={setElementDragging}
                  reorderingMode={isReorderingMode}
                  subId={subId}
                  isSearch={isSearch}
                />
              )
            })}
          </div>
      }
    </>
  )
}

export default GridView;
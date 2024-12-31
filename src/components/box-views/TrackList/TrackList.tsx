import { useState } from 'react';
import { ApiTrack, Track } from "core/types/interfaces";
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import styles from "./TrackList.module.css";
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { reorderBoxItemsThunk, reorderSubsectionItemsThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';
import TrackListRow from './TrackListRow/TrackListRow';
import { extractApiData } from 'core/helpers/itemDataHandlers';

interface IProps {
  data: ApiTrack[]
  offset?: number
  sectionType: string
  isSubsection?: boolean
  subId?: string
  isReorderingMode?: boolean
}

function TrackList({ data, offset, isSubsection, subId, isReorderingMode }: IProps) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const [elementDragging, setElementDragging] = useState(false)

  const ListHeader = () => {
    return (
      <div className={styles.trackListHeader}>
        <div className={`${styles.headerLeftAlgn}`}> # </div>
        <div className={`${styles.headerLeftAlgn}`}> Title </div>
        <div className={`${styles.headerLeftAlgn} ${styles.mobileHidden}`}> Artist </div>
        <div className={`${styles.headerLeftAlgn} ${styles.mobileHidden}`}> Duration </div>
        <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Lyrics </div>
        <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Spotify </div>
      </div>
    )
  }

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
                <ListHeader />
                <SortableContext
                  items={data.map(item => item.id!)}
                  strategy={verticalListSortingStrategy}
                >
                  {data.map((element, index) => {
                    return (
                      <TrackListRow element={extractApiData(element) as Track} itemIndex={index} setElementDragging={setElementDragging} reorderingMode={isReorderingMode ? isReorderingMode : false} />
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
                <TrackListRow element={extractApiData(element) as Track} itemIndex={index} setElementDragging={setElementDragging} reorderingMode={isReorderingMode ? isReorderingMode : false} />
              )
            })}
          </div>
      }
    </>
  )
}

export default TrackList;
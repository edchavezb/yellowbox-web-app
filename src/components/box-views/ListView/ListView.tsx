import { useState } from 'react';
import { Artist, Album, Track, Playlist } from "core/types/interfaces";
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ListRowTrack from "./ListRow/ListRowTrack"
import ListRowAlbum from "./ListRow/ListRowAlbum"
import ListRowPlaylist from "./ListRow/ListRowPlaylist"
import styles from "./ListView.module.css";
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { reorderBoxItemsThunk, reorderSubsectionItemsThunk } from 'core/features/currentBoxDetail/currentBoxDetailSlice';

interface IProps<T> {
  data: T[]
  offset?: number
  sectionType: string
  isSubsection?: boolean
  subId?: string
  isReorderingMode?: boolean
}

function ListView<T extends Artist | Album | Track | Playlist>({ data, offset, sectionType, isSubsection, subId, isReorderingMode }: IProps<T>) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const [elementDragging, setElementDragging] = useState(false)

  const getListHeader = () => {
    let listHeader;
    switch (sectionType) {
      case "tracks": // Tracklist is used for both album details, playlists, and tracks in boxes
        listHeader =
          <div className={styles.trackListHeader}>
            <div className={`${styles.headerCentered}`}> # </div>
            <div className={`${styles.headerLeftAlgn}`}> Title </div>
            <div className={`${styles.headerLeftAlgn} ${styles.mobileHidden}`}> Album </div>
            <div className={`${styles.headerLeftAlgn} ${styles.mobileHidden}`}> Duration </div>
            <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Lyrics </div>
            <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Spotify </div>
          </div>;
        break;
      case "albums": // Presents a list of albums
        listHeader =
          <div className={styles.albumListHeader}>
            <div className={`${styles.headerCentered}`}> # </div>
            <div className={`${styles.headerLeftAlgn}`}> Title </div>
            <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Year </div>
            <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Type </div>
            <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Spotify </div>
          </div>;
        break;
      case "playlists": // List of playlists
        listHeader =
          <div className={styles.playlistListHeader}>
            <div className={`${styles.headerCentered}`}> # </div>
            <div className={`${styles.headerLeftAlgn}`}> Name </div>
            <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Tracks </div>
            <div className={`${styles.headerLeftAlgn} ${styles.mobileHidden}`}> Creator </div>
            <div className={`${styles.headerCentered} ${styles.mobileHidden}`}> Spotify </div>
          </div>;
        break;
      default:
        listHeader = <div></div>;
        break;
    }
    return listHeader;
  }

  const getListItemComponent = (e: T, index: number) => {
    let itemComponent;
    switch (sectionType) {
      case "tracks":
        itemComponent =
          <ListRowTrack
            key={e.boxItemId}
            itemIndex={index}
            offset={offset}
            element={e as T as Track}
            setElementDragging={setElementDragging}
            reorderingMode={isReorderingMode ? isReorderingMode : false}
            subId={subId}
          />
        break;
      case "albums":
        itemComponent =
          <ListRowAlbum
            key={e.boxItemId}
            itemIndex={index}
            offset={offset}
            element={e as T as Album}
            setElementDragging={setElementDragging}
            reorderingMode={isReorderingMode ? isReorderingMode : false}
            subId={subId}
          />
        break;
      case "playlists":
        itemComponent =
          <ListRowPlaylist
            key={e.boxItemId}
            itemIndex={index}
            offset={offset}
            element={e as T as Playlist}
            setElementDragging={setElementDragging}
            reorderingMode={isReorderingMode ? isReorderingMode : false}
            subId={subId}
          />
        break;
      default:
        itemComponent =
          <ListRowTrack
            key={e.boxItemId}
            itemIndex={index}
            offset={offset}
            element={e as T as Track}
            setElementDragging={setElementDragging}
            reorderingMode={isReorderingMode ? isReorderingMode : false}
            subId={subId}
          />
        break;
    }
    return itemComponent;
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
                {getListHeader()}
                <SortableContext
                  items={data.map(item => item.boxItemId!)}
                  strategy={verticalListSortingStrategy}
                >
                  {data.map((element, index) => {
                    return getListItemComponent(element, index)
                  })}
                </SortableContext>
              </div>
            </DndContext>
          </>
          :
          <div className={styles.itemContainer}>
            {getListHeader()}
            {data.map((element, index) => {
              return getListItemComponent(element, index)
            })}
          </div>
      }
    </>
  )
}

export default ListView;
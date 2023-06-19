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
  sectionType: string
  isDefaultSubSection?: boolean
  subId?: string
  isReorderingMode?: boolean
}

function ListView<T extends Artist | Album | Track | Playlist>({ data, sectionType, isDefaultSubSection, subId, isReorderingMode }: IProps<T>) {
  const dispatch = useAppDispatch();
  const currentBox = useAppSelector(state => state.currentBoxDetailData.box);
  const [elementDragging, setElementDragging] = useState(false)

  const getListHeader = () => {
    let listHeader;
    switch (sectionType) {
      case "tracks": // Tracklist is used for both album details, playlists, and tracks in boxes
        listHeader =
          <div className={styles.trackListHeader}>
            <div className={styles.headerLeftAlgn}> # </div>
            <div className={styles.headerLeftAlgn}> Title </div>
            <div className={styles.headerLeftAlgn}> Artist </div>
            <div className={styles.headerLeftAlgn}> Album </div>
            <div className={styles.headerCentered}> Duration </div>
            <div className={styles.headerCentered}> Lyrics </div>
            <div className={styles.headerCentered}> Spotify </div>
          </div>;
        break;
      case "albums": // Presents a list of albums
        listHeader =
          <div className={styles.albumListHeader}>
            <div className={styles.headerLeftAlgn}> # </div>
            <div className={styles.headerLeftAlgn}> Title </div>
            <div className={styles.headerLeftAlgn}> Artist </div>
            <div className={styles.headerCentered}> Type </div>
            <div className={styles.headerCentered}> Year </div>
            <div className={styles.headerCentered}> Spotify </div>
          </div>;
        break;
      case "playlists": // List of playlists
        listHeader =
          <div className={styles.playlistListHeader}>
            <div className={styles.columnHeader}> # </div>
            <div className={styles.columnHeader}> Name </div>
            <div className={styles.columnHeader}> Description </div>
            <div className={styles.columnHeader}> Tracks </div>
            <div className={styles.columnHeader}> Creator </div>
            <div className={styles.columnHeader}> Spotify </div>
          </div>;
        break;
      default:
        listHeader = <div></div>;
        break;
    }
    return listHeader;
  }

  const getListItemComponent = (e: T) => {
    let itemComponent;
    switch (sectionType) {
      case "tracks":
        itemComponent =
          <ListRowTrack
            key={e.id}
            index={data.indexOf(e)}
            element={e as Track}
            setElementDragging={setElementDragging}
            reorderingMode={isReorderingMode ? isReorderingMode : false}
            subId={subId}
          />
        break;
      case "albums":
        itemComponent =
          <ListRowAlbum
            key={e.id}
            index={data.indexOf(e)}
            element={e as Album}
            setElementDragging={setElementDragging}
            reorderingMode={isReorderingMode ? isReorderingMode : false}
            subId={subId}
          />
        break;
      case "playlists":
        itemComponent = 
        <ListRowPlaylist 
          key={e.id} 
          index={data.indexOf(e)} 
          element={e as Playlist} 
          setElementDragging={setElementDragging} 
          reorderingMode={isReorderingMode ? isReorderingMode : false}
          subId={subId}
        />
        break;
      default:
        itemComponent =
          <ListRowTrack
            key={e.id}
            index={data.indexOf(e)}
            element={e as Track}
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
                {getListHeader()}
                <SortableContext
                  items={data.map(item => item._id!)}
                  strategy={verticalListSortingStrategy}
                >
                  {data.map((element) => {
                    return getListItemComponent(element)
                  })}
                </SortableContext>
              </div>
            </DndContext>
          </>
          :
          <div className={styles.itemContainer}>
            {getListHeader()}
            {data.map((element) => {
              return getListItemComponent(element)
            })}
          </div>
      }
    </>
  )
}

export default ListView;
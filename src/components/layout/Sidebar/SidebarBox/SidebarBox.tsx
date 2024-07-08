import { Album, Artist, DashboardBox, Playlist, Track } from "core/types/interfaces";
import styles from "./SidebarBox.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useHistory } from "react-router-dom";
import { isArtist, isAlbum, isTrack, isPlaylist, isErrorWithMessage } from "core/helpers/typeguards";
import { CSS } from '@dnd-kit/utilities';
import { SortableData, UseSortableArguments, useSortable } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";
import { extractCrucialData } from "core/helpers/itemDataHandlers";
import { addAlbumToBoxApi } from "core/api/userboxes/albums";
import { addArtistToBoxApi } from "core/api/userboxes/artists";
import { addPlaylistToBoxApi } from "core/api/userboxes/playlists";
import { addTrackToBoxApi } from "core/api/userboxes/tracks";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { initAddToBoxToast, initAlreadyInBoxToast, initErrorToast } from "core/features/toast/toastSlice";
import { BoxItemType } from "core/types/types";

type MusicData = Artist | Album | Track | Playlist;

interface SidebarBoxProps {
  box: DashboardBox;
}

export interface AppSortableData extends Omit<SortableData, 'sortable'> {
  name: string;
  sortable?: {
    containerId: UniqueIdentifier;
    items: UniqueIdentifier[];
    index: number;
  };
}

interface UseSortableTypesafeArguments extends Omit<UseSortableArguments, "data"> {
  data: AppSortableData
}

export function useAppSortable(props: UseSortableTypesafeArguments) {
  return useSortable(props);
}

const SidebarBox = ({ box }: SidebarBoxProps) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const userCreatedBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useAppSortable({
    id: box.boxId,
    data: {
      name: box.boxName
    }
  });
  const draggableStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  }

  const navigateToBox = (boxId: string) => {
    history.push(`/box/${boxId}`)
  }

  const addToBox = async (draggedData: MusicData, targetBoxId: string, userBoxes: DashboardBox[]) => {
    const userBox = userBoxes.find(box => box.boxId === targetBoxId);
    if (!!userBox) {
      try {
        if (isArtist(draggedData)) {
          await addArtistToBoxApi(targetBoxId, draggedData);
        }
        else if (isAlbum(draggedData)) {
          await addAlbumToBoxApi(targetBoxId, draggedData);
        }
        else if (isTrack(draggedData)) {
          await addTrackToBoxApi(targetBoxId, draggedData);
        }
        else if (isPlaylist(draggedData)) {
          await addPlaylistToBoxApi(targetBoxId, draggedData);
        }
        dispatch(initAddToBoxToast({ itemType: draggedData.type as BoxItemType, boxName: userBox.boxName }));
      } catch (error) {
        if (isErrorWithMessage(error) && error.message === "Item already in box") {
          dispatch(initAlreadyInBoxToast({ itemType: draggedData.type as BoxItemType, boxName: userBox.boxName }))
        }
        else {
          dispatch(initErrorToast({ error: `Failed to add item to ${userBox.boxName}` }))
        }
      }
    }
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.linkDragOver
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.boxName
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.boxName
    const data = JSON.parse(event.dataTransfer.getData("data"))
    const crucialData = extractCrucialData(data)
    addToBox(crucialData, event.currentTarget.id, userCreatedBoxes)
  }

  return (
    <div className={styles.boxLink} style={draggableStyle} id={box.boxId} onClick={() => navigateToBox(box.boxId)}
      ref={setNodeRef} {...listeners} {...attributes}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e)}>
      <div className={styles.boxName}> {box.boxName} </div>
    </div>
  )
}

export default SidebarBox;
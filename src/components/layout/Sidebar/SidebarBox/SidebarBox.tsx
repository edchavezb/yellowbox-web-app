import { Album, Artist, DashboardBox, Playlist, Track } from "core/types/interfaces";
import styles from "./SidebarBox.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useHistory } from "react-router-dom";
import { addArtistToBoxApi, addAlbumToBoxApi, addTrackToBoxApi, addPlaylistToBoxApi } from "core/api/userboxes";
import { isArtist, isAlbum, isTrack, isPlaylist } from "core/helpers/typeguards";
import { CSS } from '@dnd-kit/utilities';
import { SortableData, UseSortableArguments, useSortable } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";

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
  }

  const navigateToBox = (boxId: string) => {
    history.push(`/box/${boxId}`)
  }

  const addToBox = (draggedData: MusicData, targetBoxId: string, userBoxes: DashboardBox[]) => {
    const isOwner = !!userBoxes.find(box => box.boxId === targetBoxId);
    if (isOwner) {
      try {
        if (isArtist(draggedData)) {
          addArtistToBoxApi(targetBoxId, draggedData)
        }
        else if (isAlbum(draggedData)) {
          addAlbumToBoxApi(targetBoxId, draggedData)
        }
        else if (isTrack(draggedData)) {
          addTrackToBoxApi(targetBoxId, draggedData)
        }
        else if (isPlaylist(draggedData)) {
          addPlaylistToBoxApi(targetBoxId, draggedData)
        }
      } catch {
        console.log('Could not add item to box')
      }
    }
  }

  const extractCrucialData = (data: MusicData) => {
    let extractedData: MusicData;
    switch (data.type) {
      case "artist": {
        const { external_urls, genres, id, images, name, popularity, type, uri } = data as Artist
        extractedData = { external_urls, genres, id, images, name, popularity, type, uri, subSectionCount: 0 }
        break;
      }
      case "album": {
        const { album_type, artists, external_urls, id, images, name, release_date, total_tracks, type, uri } = data as Album
        extractedData = { album_type, artists, external_urls, id, images, name, release_date, total_tracks, type, uri, subSectionCount: 0 }
        break;
      }
      case "track": {
        const { album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri } = data as Track
        extractedData = { album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri, subSectionCount: 0 }
        break;
      }
      case "playlist": {
        const { description, external_urls, id, images, name, owner, tracks, type, uri } = data as Playlist
        const { items, ...tracksData } = tracks
        extractedData = { description, external_urls, id, images, name, owner, tracks: tracksData, type, uri, subSectionCount: 0 }
        break;
      }
      default:
        extractedData = data
    }
    return extractedData
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.linkDragOver
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.boxLink
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.boxLink
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
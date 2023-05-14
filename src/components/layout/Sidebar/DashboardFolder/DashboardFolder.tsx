import { Album, Artist, DashboardBox, Playlist, Track, UserFolder } from "core/types/interfaces";
import styles from "./DashboardFolder.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useHistory } from "react-router-dom";
import { addArtistToBoxApi, addAlbumToBoxApi, addTrackToBoxApi, addPlaylistToBoxApi } from "core/api/userboxes";
import { isArtist, isAlbum, isTrack, isPlaylist } from "core/helpers/typeguards";
import { useState } from "react";

type MusicData = Artist | Album | Track | Playlist;
interface DashboardFolderProps {
  folder: UserFolder;
}

const DashboardFolder = ({ folder }: DashboardFolderProps) => {
  const history = useHistory();
  const userCreatedBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const [isFolderOpen, setIsFolderOpen] = useState(false);

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

  const rotateStyle = { transform: `rotate(${isFolderOpen ? '90' : '0'}deg)` };

  return (
    <div className={styles.folderWrapper}>
      <div className={styles.folderLink} id={folder._id} key={folder._id}>
        <img className={styles.folderIcon} src="/icons/folder.svg" alt="folder"></img>
        <div className={styles.folderName}> {folder.name} </div>
        <div className={styles.chevronWrapper} onClick={() => setIsFolderOpen(!isFolderOpen)}>
          <img
            className={styles.chevronIcon}
            style={rotateStyle}
            src="/icons/chevronright.svg"
            alt="expand-collapse">
          </img>
        </div>
      </div>
      {isFolderOpen &&
        <div className={styles.folderContents}>
          {folder.boxes.map(box => {
            const { boxId, boxName } = box;
            return (
              <div className={styles.boxLink} id={boxId} key={boxId} onClick={() => navigateToBox(boxId)}
                onDragEnter={(e) => handleDragEnter(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e)}>
                <div className={styles.boxName}> {boxName} </div>
              </div>
            )
          })}
        </div>
      }
    </div>
  )
}

export default DashboardFolder;
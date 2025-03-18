import { Album, Artist, Playlist, Track } from "core/types/interfaces";
import styles from "./SidebarQueue.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";
import { isArtist, isAlbum, isTrack, isPlaylist, isErrorWithMessage } from "core/helpers/typeguards";
import { addArtistToQueueApi, addAlbumToQueueApi, addTrackToQueueApi, addPlaylistToQueueApi } from "core/api/userqueue";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { initAddToBoxToast, initAlreadyInBoxToast, initErrorToast } from "core/features/toast/toastSlice";
import { BoxItemType } from "core/types/types";
import { Link } from "react-router-dom";

type MusicData = Artist | Album | Track | Playlist;

const SidebarQueue = () => {
  const dispatch = useAppDispatch();
  const { authenticatedUser } = useAppSelector(state => state.userData);
  const userId = authenticatedUser?.userId;

  const addToQueue = async (draggedData: MusicData, userId: string) => {
    try {
      if (isArtist(draggedData)) {
        await addArtistToQueueApi(userId, draggedData);
      }
      else if (isAlbum(draggedData)) {
        await addAlbumToQueueApi(userId, draggedData);
      }
      else if (isTrack(draggedData)) {
        await addTrackToQueueApi(userId, draggedData);
      }
      else if (isPlaylist(draggedData)) {
        await addPlaylistToQueueApi(userId, draggedData);
      }
      dispatch(initAddToBoxToast({ itemType: draggedData.type as BoxItemType, isQueue: true }));
    } catch (error) {
      if (isErrorWithMessage(error) && error.message === "Item already in queue") {
        dispatch(initAlreadyInBoxToast({ itemType: draggedData.type as BoxItemType, isQueue: true }))
      }
      else {
        dispatch(initErrorToast({ error: `Failed to add item to queue` }))
      }
    }
  }

  const handleDragEnter = (event: React.DragEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.linkDragOver
  }

  const handleDragLeave = (event: React.DragEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.queueSection
  }

  const handleDragOver = (event: React.DragEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }

  const handleDrop = (event: React.DragEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).className = styles.queueSection
    const data = JSON.parse(event.dataTransfer.getData("data"))
    addToQueue(data, userId!)
  }

  return (
    <Link to={`/queue`}
      className={styles.queueSection}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e)}
    >
      Your queue
    </Link>
  )
}

export default SidebarQueue;
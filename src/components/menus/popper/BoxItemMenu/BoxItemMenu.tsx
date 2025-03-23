import { ModalType, setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { Artist, Album, Track, Playlist } from "core/types/interfaces";
import styles from "./BoxItemMenu.module.css";
import { Link } from "react-router-dom";
import { removeItemFromSubsectionThunk, reorderBoxItemsThunk, reorderSubsectionItemsThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { useEffect, useState } from "react";
import { BoxItemType, BoxSections } from "core/types/types";
import { isAlbum, isArtist, isErrorWithMessage, isPlaylist, isTrack } from "core/helpers/typeguards";
import { initAlreadyInBoxToast, initErrorToast } from "core/features/toast/toastSlice";
import { addQueueAlbumThunk, addQueueArtistThunk, addQueuePlaylistThunk, addQueueTrackThunk, removeQueueAlbumThunk, removeQueueArtistThunk, removeQueuePlaylistThunk, removeQueueTrackThunk } from "core/features/userQueue/userQueueSlice";

interface BoxItemMenuProps {
  itemData: Artist | Album | Track | Playlist;
  itemIndex?: number
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  itemType: string
  subId?: string
  viewMode?: string
  page?: string
  isPlayedByUser?: boolean
  togglePlayedCallback?: () => void
}

const BoxItemMenu = ({ itemData, itemIndex, isOpen, setIsOpen, subId, viewMode, page, isPlayedByUser, togglePlayedCallback }: BoxItemMenuProps) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.userData);
  const userQueue = useAppSelector(state => state.userQueueData.userQueue);
  const queueItemId = userQueue.find(item => item.itemData.spotifyId === itemData.spotifyId)?.queueItemId;
  const { isUserLoggedIn: isLoggedIn, authenticatedUser } = userData;
  const { isUserViewing: boxDetailViewing, box } = useAppSelector(state => state.currentBoxDetailData)
  const { boxId } = box || {};
  const subSection = box?.subsections?.find(sub => sub.subsectionId === subId);
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const isOwner = userBoxes.some(box => box.boxId === boxId);
  const { menuItemsList, menuItem, menuItemSuccess } = styles;
  const [isUrlCopied, setIsUrlCopied] = useState(false);

  useEffect(() => {
    setIsUrlCopied(false);
    return () => {
      setIsUrlCopied(false);
    }
  }, [isOpen])

  const handleTogglePlayed = async () => {
    if (togglePlayedCallback) {
      togglePlayedCallback();
    }
    setIsOpen(false);
  }

  const handleAddToQueue = async () => {
    const userId = authenticatedUser?.userId;
    try {
      if (isArtist(itemData)) {
        dispatch(addQueueArtistThunk(userId, itemData))
      }
      else if (isAlbum(itemData)) {
        dispatch(addQueueAlbumThunk(userId, itemData))
      }
      else if (isTrack(itemData)) {
        dispatch(addQueueTrackThunk(userId, itemData))
      }
      else if (isPlaylist(itemData)) {
        dispatch(addQueuePlaylistThunk(userId, itemData))
      }
    } catch (error) {
      if (isErrorWithMessage(error) && error.message === "Item already in queue") {
        dispatch(initAlreadyInBoxToast({ itemType: itemData.type as BoxItemType, isQueue: true }))
      }
      else {
        dispatch(initErrorToast({ error: `Failed to add item to your queue` }))
      }
    }
    setIsOpen(false);
  }

  const handleRemoveFromQueue = async () => {
    if (isArtist(itemData)) {
      dispatch(removeQueueArtistThunk(authenticatedUser?.userId!, queueItemId!, itemData.spotifyId))
    }
    else if (isAlbum(itemData)) {
      dispatch(removeQueueAlbumThunk(authenticatedUser?.userId!, queueItemId!, itemData.spotifyId))
    }
    else if (isTrack(itemData)) {
      dispatch(removeQueueTrackThunk(authenticatedUser?.userId!, queueItemId!, itemData.spotifyId))
    }
    else if (isPlaylist(itemData)) {
      dispatch(removeQueuePlaylistThunk(authenticatedUser?.userId!, queueItemId!, itemData.spotifyId))
    }
    setIsOpen(false);
  }

  const handleRemoveFromSubsection = () => {
    dispatch(removeItemFromSubsectionThunk(boxId, subId!, itemData.boxItemId!, `${itemData.type}s` as BoxSections))
    setIsOpen(false);
  }

  const handleOpenModal = (modalType: ModalType) => {
    dispatch(setModalState({
      visible: true, type: modalType, page: "", boxId, subId, itemData
    }))
    setIsOpen(false);
  }

  const handleCopyURL = () => {
    navigator.clipboard.writeText(`https://open.spotify.com/${itemData.type}/${itemData.spotifyId}`);
    setIsUrlCopied(true);
  }

  const handleMoveToBoxTop = () => {
    if (subSection) {
      dispatch(reorderSubsectionItemsThunk(boxId, itemData.boxItemId!, subId!, itemIndex!, 0));
    }
    else {
      dispatch(reorderBoxItemsThunk(boxId, itemData.boxItemId!, itemIndex!, 0, itemData.type));
    }
    setIsOpen(false);
  }

  const handleMoveToBoxBottom = () => {
    let lastItemIndex;
    if (subSection) {
      lastItemIndex = subSection.items.length - 1;
      dispatch(reorderSubsectionItemsThunk(boxId, itemData.boxItemId!, subId!, itemIndex!, lastItemIndex));
    }
    else {
      switch (itemData.type) {
        case 'artist':
          lastItemIndex = box.artists.length - 1;
          break;
        case 'album':
          lastItemIndex = box.albums.length - 1;
          break;
        case 'track':
          lastItemIndex = box.tracks.length - 1;
          break;
        case 'playlist':
          lastItemIndex = box.playlists.length - 1;
          break;
        default:
          lastItemIndex = 0;
          break;
      }
      dispatch(reorderBoxItemsThunk(boxId, itemData.boxItemId!, itemIndex!, lastItemIndex, itemData.type));
    }
    setIsOpen(false);
  }

  const handleMoveToQueueTop = () => {
  }

  const handleMoveToQueueBottom = () => {
  }

  return (
    <div className={menuItemsList}>
      {
        viewMode === 'wall' &&
        <Link to={`/detail/${itemData.type}/${itemData.spotifyId}`}>
          <div className={menuItem}>
            {`Navigate to ${itemData.type}`}
          </div>
        </Link>
      }
      {
        ( isLoggedIn && isPlayedByUser !== undefined && page !== "search" ) &&
        <div
          className={menuItem}
          onClick={() => handleTogglePlayed()}>
          {isPlayedByUser ? 'Mark as unplayed' : 'Mark as played'}
        </div>
      }
      {
        (isLoggedIn && !queueItemId) &&
        <div
          className={menuItem}
          onClick={() => handleAddToQueue()}>
          Add to your queue
        </div>
      }
      {
        (isLoggedIn && queueItemId) &&
        <div
          className={menuItem}
          onClick={handleRemoveFromQueue}>
          Remove from your queue
        </div>
      }
      {
        isLoggedIn &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Add To Box")}>
          Add to box...
        </div>
      }
      {
        (boxDetailViewing && isOwner) &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Add To Subsection")}>
          Add to subsections...
        </div>
      }
      {
        (boxDetailViewing && isOwner && itemData.subsectionId) &&
        <div
          className={menuItem}
          onClick={handleRemoveFromSubsection}>
          Remove from this subsection
        </div>
      }
      {
        (boxDetailViewing && isOwner) &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Delete Item")}>
          Remove from this box
        </div>
      }
      {
        ((boxDetailViewing && isOwner && box.sectionSettings.find(section => section.type === `${itemData.type}s`)?.primarySorting === "custom") || queueItemId) &&
        <div
          className={menuItem}
          onClick={queueItemId ? handleMoveToQueueTop : handleMoveToBoxTop}>
          Move to start of list
        </div>
      }
      {
        ((boxDetailViewing && isOwner && box.sectionSettings.find(section => section.type === `${itemData.type}s`)?.primarySorting === "custom") || queueItemId) &&
        <div
          className={menuItem}
          onClick={queueItemId ? handleMoveToQueueBottom : handleMoveToBoxBottom}>
          Move to end of list
        </div>
      }
      {
        (boxDetailViewing && isOwner) &&
        <div
          className={menuItem}
          onClick={() => handleOpenModal("Item Note")}>
          {itemData.note ? 'View note' : 'Add note'}
        </div>
      }
      <a href={`spotify:${itemData.type}:${itemData.spotifyId}`}>
        <div className={menuItem}>
          Open on Spotify
        </div>
      </a>
      <div
        className={isUrlCopied ? menuItemSuccess : menuItem}
        onClick={() => handleCopyURL()}>
        {isUrlCopied ? 'URL copied!' : 'Copy Spotify URL'}
      </div>
    </div>
  );
};

export default BoxItemMenu;
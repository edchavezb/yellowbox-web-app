import { ModalType, setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { Artist, Album, Track, Playlist } from "core/types/interfaces";
import styles from "./BoxItemMenu.module.css";
import { Link } from "react-router-dom";
import { reorderBoxItemsThunk, reorderSubsectionItemsThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";

interface BoxItemMenuProps {
  itemData: Artist | Album | Track | Playlist;
  itemIndex?: number
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  itemType: string
  subId?: string
  viewMode?: string
}

const BoxItemMenu = ({ itemData, itemIndex, setIsOpen, subId, viewMode }: BoxItemMenuProps) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.userData.isUserLoggedIn);
  const { isUserViewing: boxDetailViewing, box } = useAppSelector(state => state.currentBoxDetailData)
  const { boxId } = box || {};
  const subSection = box?.subsections?.find(sub => sub.subsectionId === subId);
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes)
  const isOwner = userBoxes.some(box => box.boxId === boxId);
  const { menuItemsList, menuItem } = styles;

  const handleAddToQueue = () => {
    //TODO: Implement add to queue
  }

  const handleOpenModal = (modalType: ModalType) => {
    dispatch(setModalState({
      visible: true, type: modalType, page: "", boxId, subId, itemData
    }))
    setIsOpen(false);
  }

  const handleCopyURL = () => {
    navigator.clipboard.writeText(`https://open.spotify.com/${itemData.type}/${itemData.spotifyId}`);
  }

  const handleMoveToTop = () => {
    if (subSection) {
      dispatch(reorderSubsectionItemsThunk(boxId, itemData.boxItemId!, subId!, itemIndex!, 0));
    }
    else {
      dispatch(reorderBoxItemsThunk(boxId, itemData.boxItemId!, itemIndex!, 0, itemData.type));
    }
    setIsOpen(false);
  }

  const handleMoveToBottom = () => {
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
        isLoggedIn &&
        <div
          className={menuItem}
          onClick={() => handleAddToQueue()}>
          Add to your queue
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
          Add to subsection...
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
        (boxDetailViewing && isOwner && box.sectionSettings.find(section => section.type === `${itemData.type}s`)?.primarySorting === "custom") &&
        <div
          className={menuItem}
          onClick={() => handleMoveToTop()}>
          Move to start of list
        </div>
      }
      {
        (boxDetailViewing && isOwner && box.sectionSettings.find(section => section.type === `${itemData.type}s`)?.primarySorting === "custom") &&
        <div
          className={menuItem}
          onClick={() => handleMoveToBottom()}>
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
      <div
        className={menuItem}
        onClick={() => handleCopyURL()}>
        Copy Spotify URL
      </div>
      <a href={`spotify:${itemData.type}:${itemData.spotifyId}`}>
        <div className={menuItem}>
          Open on Spotify
        </div>
      </a>
    </div>
  );
};

export default BoxItemMenu;
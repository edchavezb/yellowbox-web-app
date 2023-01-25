import { removeBoxAlbumThunk, removeBoxArtistThunk, removeBoxPlaylistThunk, removeBoxTrackThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { setModalState } from "core/features/modal/modalSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { AppThunk } from "core/store/store";
import { Album, Artist, Playlist, Track } from "../../core/types/interfaces";
import styles from "./DeletePrompt.module.css";

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
  boxId: string
  itemData: MusicData
}

function DeletePrompt({itemData, boxId}: IProps) {
  const dispatch = useAppDispatch();
  let deleteAction: (box: string, item: string) => AppThunk;

  switch(itemData.type){
    case "artist":
      deleteAction = removeBoxArtistThunk
    break;
    case "album":
      deleteAction = removeBoxAlbumThunk
    break;
    case "track":
      deleteAction = removeBoxTrackThunk
    break;
    case "playlist":
      deleteAction = removeBoxPlaylistThunk
    break;
    default:
      deleteAction = removeBoxArtistThunk
  }

  const handleDeleteItem = () => {
    dispatch(deleteAction(boxId, itemData._id!))
    dispatch(setModalState({visible: false, type:"", boxId:"", page: "", itemData: undefined}))
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <h3> Are you sure you want to remove this item from the box? </h3>
      </div>
      <div id={styles.modalFooter}>
        <button onClick={() => handleDeleteItem()}> Yes, delete item </button>
        <button onClick={() => dispatch(setModalState({visible: false, type:"", boxId:"", page: "", itemData: undefined}))}> Cancel </button>
      </div>
    </div>
  )
}

export default DeletePrompt;
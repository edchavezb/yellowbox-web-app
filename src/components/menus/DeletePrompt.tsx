import { removeBoxAlbumThunk, removeBoxArtistThunk, removeBoxPlaylistThunk, removeBoxTrackThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { setModalState } from "core/features/modal/modalSlice";
import { deleteUserBoxThunk } from "core/features/userBoxes/userBoxesSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { AppThunk } from "core/store/store";
import { useHistory } from "react-router-dom";
import { Album, Artist, Playlist, Track } from "../../core/types/interfaces";
import styles from "./DeletePrompt.module.css";
import { useSelector } from "react-redux";
import { useAppSelector } from "core/hooks/useAppSelector";

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
  boxId: string
  itemData?: MusicData
  deleteType: "Box" | "Item"
}

function DeletePrompt({itemData, boxId, deleteType}: IProps) {
  const dispatch = useAppDispatch();
  const userFolders = useAppSelector(state => state.userFoldersData.folders)
  const history = useHistory();
  let promptMessage: string;
  let deleteItem: (box: string, item: string) => AppThunk;

  if (deleteType === "Item" && itemData){
    switch(itemData.type){
      case "artist":
        deleteItem = removeBoxArtistThunk
      break;
      case "album":
        deleteItem = removeBoxAlbumThunk
      break;
      case "track":
        deleteItem = removeBoxTrackThunk
      break;
      case "playlist":
        deleteItem = removeBoxPlaylistThunk
      break;
      default:
        deleteItem = removeBoxArtistThunk
    }
  }

  switch(deleteType){
    case "Box":
      promptMessage = 'Are you sure you want to delete this box from your collection?'
    break;
    case "Item":
      promptMessage = 'Are you sure you want to remove this item from the box?'
    break;
    default:
      promptMessage = ''
  }

  const handleDeleteAction = () => {
    if (deleteType === "Box"){
      const containingFolderId = userFolders.find(folder => folder.boxes.map(dashboardBox => dashboardBox.boxId).includes(boxId))?._id;
      dispatch(deleteUserBoxThunk(boxId, !!containingFolderId, containingFolderId));
      history.push('/')
    }
    else if (deleteType === "Item" && itemData){
      dispatch(deleteItem(boxId, itemData._id!));
    }
    dispatch(setModalState({visible: false, type:"", boxId:"", page: "", itemData: undefined}))
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <h3> {promptMessage} </h3>
      </div>
      <div id={styles.modalFooter}>
        <button onClick={() => handleDeleteAction()}> Yes, delete it </button>
        <button onClick={() => dispatch(setModalState({visible: false, type:"", boxId:"", page: "", itemData: undefined}))}> Cancel </button>
      </div>
    </div>
  )
}

export default DeletePrompt;
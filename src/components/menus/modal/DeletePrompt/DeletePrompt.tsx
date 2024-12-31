import { removeBoxAlbumThunk, removeBoxArtistThunk, removeBoxPlaylistThunk, removeBoxTrackThunk } from "core/features/currentBoxDetail/currentBoxDetailSlice";
import { setModalState } from "core/features/modal/modalSlice";
import { deleteUserBoxThunk } from "core/features/userBoxes/userBoxesSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { AppThunk } from "core/store/store";
import { useHistory } from "react-router-dom";
import { Album, Artist, Playlist, Track } from "core/types/interfaces";
import styles from "./DeletePrompt.module.css";
import { useAppSelector } from "core/hooks/useAppSelector";
import { deleteUserFolderThunk } from "core/features/userFolders/userFoldersSlice";
import AppButton from "components/styled/AppButton/AppButton";
import { Text } from '@chakra-ui/react'

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
  folderId?: string
  boxId?: string
  itemData?: MusicData
  deleteType: "Folder" | "Box" | "Item"
}

function DeletePrompt({ itemData, boxId, folderId, deleteType }: IProps) {
  const dispatch = useAppDispatch();
  const userFolders = useAppSelector(state => state.userFoldersData.folders);
  const userBoxes = useAppSelector(state => state.userBoxesData.userBoxes);
  const boxName = userBoxes.find(box => box.boxId === boxId)?.name || "";
  const history = useHistory();
  let promptMessage: string;
  let deleteItem: (boxId: string, boxName: string, boxItemId: string) => AppThunk;

  if (deleteType === "Item" && itemData) {
    switch (itemData.type) {
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

  switch (deleteType) {
    case "Folder":
      promptMessage = 'Are you sure you want to delete this folder? The boxes it contains will not be deleted.'
      break;
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
    if (deleteType === "Folder") {
      dispatch(deleteUserFolderThunk(folderId!));
      history.push('/')
    }
    else if (deleteType === "Box") {
      const containingFolderId = userFolders.find(folder => folder.boxes.map(dashboardBox => dashboardBox.boxId).includes(boxId!))?.folderId;
      dispatch(deleteUserBoxThunk(boxId!, !!containingFolderId, containingFolderId));
      history.push('/')
    }
    else if (deleteType === "Item" && itemData) {
      dispatch(deleteItem(boxId!, boxName, itemData.boxItemId!));
    }
    dispatch(setModalState({ visible: false, type: "", boxId: "", folderId: "", page: "", itemData: undefined }))
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <Text fontSize={"lg"} fontWeight={"700"} sx={{ marginTop: '10px', marginBottom: "20px" }}> {promptMessage} </Text>
      </div>
      <div id={styles.modalFooter}>
        <AppButton
          onClick={() => handleDeleteAction()}
          text={"Yes, delete it"}
        />
        <AppButton
          onClick={() => dispatch(setModalState({ visible: false, type: "", boxId: "", page: "", folderId: "", itemData: undefined }))}
          text={"Cancel"}
        />
      </div>
    </div>
  )
}

export default DeletePrompt;
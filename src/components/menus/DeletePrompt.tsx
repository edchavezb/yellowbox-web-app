import { Dispatch, SetStateAction } from "react";
import { UserBox, UpdateBoxPayload, ModalState, Album, Artist, Playlist, Track } from "../../interfaces";
import styles from "./DeletePrompt.module.css";

enum UserBoxesActionTypes {
  UPDATE_BOX = 'UPDATE_BOX',
  NEW_BOX = 'NEW_BOX',
  DELETE_BOX = 'DELETE_BOX',
}

type BoxSections = Pick<UserBox, "albums" | "artists" | "tracks" | "playlists">

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
  userBoxes: UserBox[]
  boxId: string
  itemData: MusicData
  dispatch: React.Dispatch<{
    type: UserBoxesActionTypes;
    payload: UpdateBoxPayload;
  }>
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function DeletePrompt({itemData, userBoxes, boxId, toggleModal, dispatch}: IProps) {

  let sectionType: string;

  switch(itemData.type){
    case "artist":
      sectionType = "artists"
    break;
    case "album":
      sectionType = "albums"
    break;
    case "track":
      sectionType = "tracks"
    break;
    default:
      sectionType = "none"
  }

  const handleDeleteItem = <T extends Artist & Album & Track & Playlist>() => {
    const targetIndex = userBoxes.findIndex(box => box.id === boxId)
    const targetBox = {...userBoxes.find(box => box.id === boxId) as UserBox}
    const targetSection = targetBox[sectionType as keyof BoxSections]
    const filteredSection = (targetSection as Array<T>).filter((item: T) => item.id !== itemData.id)
    let updatedBox: UserBox = JSON.parse(JSON.stringify(targetBox))
    updatedBox[sectionType as keyof BoxSections] = filteredSection
    dispatch({ type: UserBoxesActionTypes["UPDATE_BOX"], payload: { updatedBox: updatedBox, targetIndex: targetIndex } })
    toggleModal({ visible: false, type: "", boxId:"", itemData: undefined, page:""})
  } //TODO: Better implementation

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <h3> Are you sure you want to remove this item from the box? </h3>
      </div>
      <div id={styles.modalFooter}>
        <button onClick={() => handleDeleteItem()}> Yes, delete item </button>
        <button onClick={() => toggleModal({ visible: false, type: "", boxId:"", itemData: undefined, page:"" })}> Cancel </button>
      </div>
    </div>
  )
}

export default DeletePrompt;
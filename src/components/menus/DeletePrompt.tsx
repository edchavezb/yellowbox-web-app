import { setModalState } from "core/features/modal/modalSlice";
import { updateUserBox } from "core/features/userBoxes/userBoxesSlice";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { useAppSelector } from "core/hooks/useAppSelector";
import { UserBox, Album, Artist, Playlist, Track } from "../../core/types/interfaces";
import styles from "./DeletePrompt.module.css";

type BoxSections = Pick<UserBox, "albums" | "artists" | "tracks" | "playlists">

type MusicData = Artist | Album | Track | Playlist;

interface IProps {
  boxId: string
  itemData: MusicData
}

function DeletePrompt({itemData, boxId}: IProps) {
  const dispatch = useAppDispatch();
  const userBoxes = useAppSelector(state => state.userBoxesData.boxes)

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
    const targetBox = {...userBoxes.find(box => box._id === boxId) as UserBox}
    const targetSection = targetBox[sectionType as keyof BoxSections]
    const filteredSection = (targetSection as Array<T>).filter((item: T) => item.id !== itemData.id)
    let updatedBox: UserBox = JSON.parse(JSON.stringify(targetBox))
    updatedBox[sectionType as keyof BoxSections] = filteredSection
    dispatch(updateUserBox({ updatedBox: updatedBox, targetId: boxId }))
    dispatch(setModalState({visible: false, type:"", boxId:"", page: "", itemData: undefined}))
  } //TODO: Better implementation

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
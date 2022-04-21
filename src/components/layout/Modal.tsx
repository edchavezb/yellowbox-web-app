import styles from "./Modal.module.css";
import SortingMenu from "../menus/SortingMenu";
import NewBoxMenu from "../menus/NewBoxMenu";
import DeletePrompt from "../menus/DeletePrompt";
import AddToMenu from "../menus/AddToMenu";
import { Album, Artist, ModalState, Playlist, Track, UserBox } from "../../interfaces";
import { Dispatch, SetStateAction } from "react";

enum UpdateBoxTypes {
  UPDATE_BOX = 'UPDATE_BOX',
  NEW_BOX = 'NEW_BOX',
  DELETE_BOX = 'DELETE_BOX',
}

interface UpdateBoxPayload {
  updatedBox: UserBox
  targetIndex?: number
  targetId?: string
}

interface IProps {
	itemData?: Artist | Album | Track | Playlist
  type: string
  page?: string
  visible: boolean
  userBoxes: UserBox[]
  boxId: string
  dispatch: React.Dispatch<{
    type: UpdateBoxTypes;
    payload: UpdateBoxPayload;
  }>
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function Modal({itemData, type, page, visible, userBoxes, toggleModal, dispatch, boxId}: IProps) {

  let modalBody: JSX.Element | string = "";

  switch(type){
    case "New Box" :
      modalBody = <NewBoxMenu toggleModal={toggleModal} dispatch={dispatch} userBoxes={userBoxes} />
    break;
    case "Sorting Options" :
      modalBody = <SortingMenu toggleModal={toggleModal} dispatch={dispatch} userBoxes={userBoxes} boxId={boxId} />
    break;
    case "Delete Item" :
      modalBody = <DeletePrompt toggleModal={toggleModal} dispatch={dispatch} userBoxes={userBoxes} boxId={boxId} itemData={itemData!} />
    break;
    case "Add To" :
      modalBody = <AddToMenu toggleModal={toggleModal} dispatch={dispatch} userBoxes={userBoxes} boxId={boxId} itemData={itemData!} page={page!}/>
    break;
    default:
      modalBody = ""
  }


  if(visible){
    return (
      <div id={styles.modalDiv}> 
        <div id={styles.modalPanel}>
          <div id={styles.modalHeader}>
            <div id={styles.modalTitle}> {type} </div>
            <div id={styles.closeModal} onClick={() => toggleModal({visible: false, type:"", boxId:"", page: "", itemData: undefined})}>
              <img id={styles.closeIcon} alt="Close modal" src="/icons/close.svg"/>
            </div>
          </div>
          {modalBody}
        </div>
      </div>
    );
  } else {
    return null
  }
  
}

export default Modal;
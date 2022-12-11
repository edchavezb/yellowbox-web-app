import styles from "./Modal.module.css";
import SortingMenu from "../menus/SortingMenu";
import NewBoxMenu from "../menus/NewBoxMenu";
import DeletePrompt from "../menus/DeletePrompt";
import AddToMenu from "../menus/AddToMenu";
import { Album, Artist, ModalState, Playlist, Track, UserBox, YellowboxUser } from "../../core/types/interfaces";
import { Dispatch, SetStateAction } from "react";

interface IProps {
  user?: YellowboxUser
	itemData?: Artist | Album | Track | Playlist
  type: string
  page?: string
  visible: boolean
  boxId: string
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function Modal({user, itemData, type, page, visible, toggleModal, boxId}: IProps) {

  let modalBody: JSX.Element | string = "";

  switch(type){
    case "New Box" :
      modalBody = <NewBoxMenu toggleModal={toggleModal} user={user!}/>
    break;
    case "Sorting Options" :
      modalBody = <SortingMenu toggleModal={toggleModal} boxId={boxId} />
    break;
    case "Delete Item" :
      modalBody = <DeletePrompt toggleModal={toggleModal} boxId={boxId} itemData={itemData!} />
    break;
    case "Add To" :
      modalBody = <AddToMenu toggleModal={toggleModal} boxId={boxId} itemData={itemData!} page={page!}/>
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
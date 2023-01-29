import styles from "./Modal.module.css";
import SortingMenu from "../menus/SortingMenu";
import NewBoxMenu from "../menus/NewBoxMenu";
import DeletePrompt from "../menus/DeletePrompt";
import AddToMenu from "../menus/AddToMenu";
import ItemNote from "components/menus/ItemNote";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { setModalState } from "core/features/modal/modalSlice";

function Modal() {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(state => state.modalData.modalState)
  let modalBody: JSX.Element | string = "";

  switch(modalData.type){
    case "New Box" :
      modalBody = <NewBoxMenu/>
    break;
    case "Sorting Options" :
      modalBody = <SortingMenu/>
    break;
    case "Delete Item" :
      modalBody = <DeletePrompt boxId={modalData.boxId} itemData={modalData.itemData!} />
    break;
    case "Add To Box" :
      modalBody = <AddToMenu boxId={modalData.boxId} itemData={modalData.itemData!} page={modalData.page!}/>
    break;
    case "Item Note" :
      modalBody = <ItemNote boxId={modalData.boxId} itemData={modalData.itemData!} />
    break;
    default:
      modalBody = ""
  }


  if(modalData.visible){
    return (
      <div id={styles.modalDiv}> 
        <div id={styles.modalPanel}>
          <div id={styles.modalHeader}>
            <div id={styles.modalTitle}> {modalData.type} </div>
            <div id={styles.closeModal} onClick={() => dispatch(setModalState({visible: false, type:"New Box", boxId:"", page: "", itemData: undefined}))}>
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
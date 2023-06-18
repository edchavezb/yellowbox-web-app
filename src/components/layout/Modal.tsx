import styles from "./Modal.module.css";
import SortingMenu from "../menus/SortingMenu";
import NewBoxMenu from "../menus/NewBoxMenu";
import DeletePrompt from "../menus/DeletePrompt";
import AddToBoxMenu from "../menus/AddToBoxMenu";
import ItemNote from "components/menus/ItemNote";
import { useAppSelector } from "core/hooks/useAppSelector";
import { useAppDispatch } from "core/hooks/useAppDispatch";
import { setModalState } from "core/features/modal/modalSlice";
import SubsectionsMenu from "components/menus/SubsectionsMenu/SubsectionsMenu";
import AddToSubsectionMenu from "components/menus/AddToSubsectionMenu";
import NewFolderMenu from "components/menus/NewFolderMenu";
import AddToFolderMenu from "components/menus/AddToFolderMenu";

function Modal() {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(state => state.modalData.modalState)
  let modalBody: JSX.Element | string = "";

  switch(modalData.type){
    case "New Box" :
      modalBody = <NewBoxMenu editMode={false}/>
    break;
    case "Edit Box" :
      modalBody = <NewBoxMenu editMode={true} />
    break;
    case "Delete Box" :
      modalBody = <DeletePrompt boxId={modalData.boxId as string} itemData={modalData.itemData!} deleteType={"Box"} />
    break;
    case "New Folder" :
      modalBody = <NewFolderMenu editMode={false}/>
    break;
    case "Edit Folder" :
      modalBody = <NewFolderMenu editMode={true}/>
    break;
    case "Delete Folder" :
      modalBody = <DeletePrompt folderId={modalData.folderId as string} itemData={modalData.itemData!} deleteType={"Folder"} />
    break;
    case "Sorting Options" :
      modalBody = <SortingMenu/>
    break;
    case "Delete Item" :
      modalBody = <DeletePrompt boxId={modalData.boxId as string} itemData={modalData.itemData!} deleteType={"Item"} />
    break;
    case "Add To Folder" :
      modalBody = <AddToFolderMenu boxId={modalData.boxId as string} page={modalData.page!}/>
    break;
    case "Add To Box" :
      modalBody = <AddToBoxMenu itemData={modalData.itemData!} />
    break;
    case "Add To Subsection" :
      modalBody = <AddToSubsectionMenu itemData={modalData.itemData!}/>
    break;
    case "Item Note" :
      modalBody = <ItemNote boxId={modalData.boxId as string} itemData={modalData.itemData!} subId={modalData.subId} />
    break;
    case "Box Subsections" :
      modalBody = <SubsectionsMenu />
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
            <div id={styles.closeModal} onClick={() => dispatch(setModalState({visible: false, type:"", boxId:"", page: "", itemData: undefined}))}>
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
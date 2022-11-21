import GridView from "./GridView"
import ListView from "./ListView"
import DetailView from "./DetailView"
import styles from "./SubSection.module.css";
import { Album, Artist, ModalState, Playlist, Track } from "../../core/types/interfaces";
import { Dispatch, SetStateAction } from "react";

interface IProps<T> {
	itemsMatch: T[]
  subName: string
  viewType: string
  sectionType: string
  boxId: string
  isDefault: boolean
  customSorting: boolean
  page?: string
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function SubSection<T extends Artist | Album | Track | Playlist>({itemsMatch, subName, viewType, sectionType, toggleModal, boxId, isDefault, page, customSorting}: IProps<T>) {
  console.log(itemsMatch)

  const getListType = (sectionType: string) => {
    let listType;
    switch (sectionType) {
      case 'Albums':
        listType = "albumlist"
        break;
      case 'Artists':
        listType = "none";
        break;
      case 'Tracks':
        listType = "tracklist"
        break;
      case 'Playlists':
        listType = "playlists"
        break;
      default:
        listType = "none";
        break;
    }
    return listType;
  }

  const displayView = (data: T[], page: string, isCustom: boolean) => {
    let sectionView: JSX.Element;
    switch (viewType){
      case "grid":
        sectionView = <GridView data={data} page={page} customSorting={isCustom} toggleModal={toggleModal} boxId={boxId} />
      break;
      case "list":
        sectionView = <ListView data={data} page={page} customSorting={isCustom} toggleModal={toggleModal} boxId={boxId} listType={getListType(sectionType)}/>
      break;
      case "details":
        sectionView = <DetailView data={data} page={page} customSorting={isCustom} toggleModal={toggleModal} boxId={boxId} />
      break;
      default:
        sectionView = <div></div>
    }
    return sectionView
  }

  return (
    <div className={styles.subSectionWrapper} key={subName}>
      {!isDefault ? <div className={styles.subSectionName}> {subName} </div> : "" }
        {displayView(itemsMatch, page as string, customSorting)}
    </div>
  )
}

export default SubSection;
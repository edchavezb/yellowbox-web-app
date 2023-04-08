import GridView from "./GridView"
import ListView from "./ListView"
import DetailView from "./DetailView"
import styles from "./SubSection.module.css";
import { Album, Artist, Playlist, Track } from "../../core/types/interfaces";

interface IProps<T> {
  itemsMatch: T[]
  subName: string
  subId?: string
  viewType: string
  sectionType: string
  boxId: string
  isDefault: boolean
  isOwner?: boolean
  customSorting: boolean
  page?: string
  isReorderingMode?: boolean
}

function SubSection<T extends Artist | Album | Track | Playlist>({
  itemsMatch,
  subName,
  subId,
  viewType,
  sectionType,
  boxId,
  isOwner,
  isDefault,
  page,
  customSorting,
  isReorderingMode
}: IProps<T>) {
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

  const displayView = (data: T[], page: string, isCustom: boolean, isDefault: boolean) => {
    let sectionView: JSX.Element;
    switch (viewType) {
      case "grid":
        sectionView = <GridView isOwner={isOwner} data={data} page={page} customSorting={isCustom} boxId={boxId} isDefaultSubSection={isDefault} subId={subId} isReorderingMode={isReorderingMode} />
        break;
      case "list":
        sectionView = <ListView isOwner={isOwner} data={data} page={page} customSorting={isCustom} isDefaultSubSection={isDefault} listType={getListType(sectionType)} subId={subId} isReorderingMode={isReorderingMode} />
        break;
      case "details":
        sectionView = <DetailView isOwner={isOwner} data={data} page={page} customSorting={isCustom} boxId={boxId} isDefaultSubSection={isDefault} subId={subId} isReorderingMode={isReorderingMode} />
        break;
      default:
        sectionView = <div></div>
    }
    return sectionView
  }

  return (
    <div className={styles.subSectionWrapper} key={subName}>
      {!isDefault ? <div className={styles.subSectionName}> {subName} </div> : ""}
      {displayView(itemsMatch, page as string, customSorting, isDefault)}
    </div>
  )
}

export default SubSection;
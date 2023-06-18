import GridView from "./GridView"
import ListView from "./ListView"
import DetailView from "./DetailView"
import WallView from "./WallView";
import styles from "./SubSection.module.css";
import { Album, Artist, Playlist, Track } from "../../core/types/interfaces";

interface IProps<T> {
  itemsMatch: T[]
  subName: string
  subId?: string
  viewType: string
  sectionType: string
  isDefault: boolean
  isReorderingMode?: boolean
}

function SubSection<T extends Artist | Album | Track | Playlist>({
  itemsMatch,
  subName,
  subId,
  viewType,
  sectionType,
  isDefault,
  isReorderingMode
}: IProps<T>) {

  const displayView = (data: T[], isDefault: boolean) => {
    let sectionView: JSX.Element;
    switch (viewType) {
      case "grid":
        sectionView = <GridView data={data} isDefaultSubSection={isDefault} subId={subId} isReorderingMode={isReorderingMode} />
        break;
      case "list":
        sectionView = <ListView data={data} isDefaultSubSection={isDefault} subId={subId} isReorderingMode={isReorderingMode} sectionType={sectionType}  />
        break;
      case "details":
        sectionView = <DetailView data={data} isDefaultSubSection={isDefault} subId={subId} isReorderingMode={isReorderingMode} />
        break;
      case "wall":
        sectionView = <WallView data={data} isDefaultSubSection={isDefault} subId={subId} isReorderingMode={isReorderingMode} />
        break;
      default:
        sectionView = <div></div>
    }
    return sectionView
  }

  return (
    <div className={styles.subSectionWrapper} key={subName}>
      {!isDefault ? <div className={styles.subSectionName}> {subName} </div> : ""}
      {displayView(itemsMatch, isDefault)}
    </div>
  )
}

export default SubSection;
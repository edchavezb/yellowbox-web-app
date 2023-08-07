import styles from "./SubSection.module.css";
import { Album, Artist, Playlist, Track } from "core/types/interfaces";
import ViewComponent from "components/box-views/ViewComponent/ViewComponent";

interface IProps<T> {
  itemsMatch: T[]
  subName: string
  subId?: string
  viewType: string
  listType?: string
  isReorderingMode: boolean
}

function SubSection<T extends Artist | Album | Track | Playlist>({
  itemsMatch,
  subName,
  subId,
  viewType,
  listType,
  isReorderingMode
}: IProps<T>) {

  return (
    <div className={styles.subSectionWrapper} key={subName}>
      <div className={styles.subSectionName}> {subName} </div>
      <ViewComponent data={itemsMatch} viewType={viewType} listType={listType} isSubsection subId={subId} isReorderingMode={isReorderingMode}  />
    </div>
  )
}

export default SubSection;
import GridView from "./GridView"
import ListView from "./ListView"
import DetailView from "./DetailView"
import styles from "./SubSection.module.css";

function SubSection({itemsMatch, subName, viewType, sectionType, toggleModal, boxId, isDefault, page, customSorting}) {
  console.log(itemsMatch)

  const getListType = (sectionType) => {
    let listType;
    switch (sectionType) {
      case 'Albums':
        listType = "albumlist"
        break;
      case 'Artists':
        listType = undefined;
        break;
      case 'Tracks':
        listType = "tracklist"
        break;
      case 'Playlists':
        listType = "playlists"
        break;
      default:
        listType = undefined;
        break;
    }
    return listType;
  }

  const displayView = (data, page, isCustom) => {
    let sectionView = ""
    switch (viewType){
      case "grid":
        sectionView = <GridView data={data} page={page} customSorting={isCustom} toggleModal={toggleModal} boxId={boxId} />
      break;
      case "list":
        sectionView = <ListView listType={getListType(sectionType)} data={data} page={page} customSorting={isCustom} toggleModal={toggleModal} boxId={boxId} />
      break;
      case "details":
        sectionView = <DetailView listType={getListType(sectionType)} data={data} page={page} customSorting={isCustom} toggleModal={toggleModal} boxId={boxId} />
      break;
      default:
    }
    return sectionView
  }

  return (itemsMatch.length > 0 ?
    <div className={styles.subSectionWrapper} key={subName}>
      {!isDefault ? <div className={styles.subSectionName}> {subName} </div> : "" }
        {displayView(itemsMatch, page, customSorting)}
    </div>
    : "")
}

export default SubSection;
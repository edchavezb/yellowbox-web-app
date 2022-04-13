import { useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';

import SubSection from "./SubSection"
import styles from "./BoxSection.module.css";
import { Album, Artist, Playlist, Sorting, Track, UserBox } from '../../interfaces';
import  * as checkType from  "../../typeguards";
import ItemDetail from '../../pages/ItemDetail';

interface IProps<T> {
	data: T[]
  type: string
  box: UserBox
  sorting: Sorting
  visible: boolean
	toggleModal: (toggle: {visible: boolean, type: string, boxId: string}) => void
}

function BoxSection<T extends Artist | Album | Track | Playlist>({data, type, box, sorting, visible, toggleModal}: IProps<T>) {

  const [height, setHeight] = useState<string | number>("auto")

  useEffect(() => {
    const heightProp = visible ? "auto" : 0
    setHeight(heightProp)
  }, [visible])

  function getProperty(item: T, itemType: string, propertyName: string, upperCased: boolean): string | number | Date{
    let propertyValue: string | number | Date

    switch (propertyName) {
      case "release_year":
        propertyValue = checkType.isTrack(item) ? parseInt(item.album["release_date"].split("-")[0]) 
            : checkType.isAlbum(item) ? parseInt(item["release_date"].split("-")[0]) : ""
      break;
      case "release_date":
        propertyValue = checkType.isTrack(item) ? new Date(item.album.release_date) 
            : checkType.isAlbum(item) ? new Date(item.release_date) : ""
      break;
      case "artist":
        propertyValue = checkType.isArtist(item) || checkType.isPlaylist(item) ? "" : item.artists[0].name
      break;
      case "name":
        propertyValue = item.name
      break;
      case "album":
        propertyValue = checkType.isTrack(item) ? item.album.name : ""
      break;
      case "duration":
        propertyValue = checkType.isTrack(item) ? item.duration_ms : ""
      break;
      case "track_number":
        propertyValue = checkType.isTrack(item) ? item.track_number : ""
      break;
      default:
        propertyValue = ""
    }

    return typeof propertyValue === "string" && upperCased ? propertyValue.toUpperCase() : propertyValue
  }

  const twoFactorSort = (array: T[], type: string, sortFactorOne: string, sortFactorTwo: string, ascending: boolean) => {
    if (sortFactorOne === "custom") return array
    const sortOrderFactor = ascending ? 1 : -1;

    array.sort((a, b) => {
      const [factorOneInA, factorOneInB] = [getProperty(a, type, sortFactorOne, true), getProperty(b, type, sortFactorOne, true)]
      const [factorTwoInA, factorTwoInB] = [getProperty(a, type, sortFactorTwo, true), getProperty(b, type, sortFactorTwo, true)]

      if (factorOneInA < factorOneInB) return -1 * sortOrderFactor;
      else if (factorOneInA > factorOneInB) return 1 * sortOrderFactor; 
      else if (sortFactorTwo){
        if(factorTwoInA < factorTwoInB) return -1 * sortOrderFactor;
        else if (factorTwoInA > factorTwoInB) return 1 * sortOrderFactor;
      }
      return 0
    }) 

    return array
  }

  const showSubSections = (array: string[]) => {
    return array.map(s => {

      const itemsMatch = sorting.primarySorting === "custom" ? 
        sortedData.filter(e => e.subSection === s) 
        : sortedData.filter(e => getProperty(e, type, sorting.primarySorting, false) === s)
      
      return itemsMatch.length > 0 &&
        <SubSection itemsMatch={itemsMatch} page="box" subName={s} key={s} viewType={sorting.view} toggleModal={toggleModal} 
          sectionType={""} isDefault={false} customSorting={sorting.primarySorting === "custom"} boxId={""}/>

    })
  } 

  const sectionIconSrc = `/icons/${type.toLowerCase()}.svg`
  const sortedData = twoFactorSort([...data], type, sorting.primarySorting, sorting.secondarySorting, sorting.ascendingOrder)
  const subSectionNameArr = sorting.primarySorting === "custom" ? 
    //This gets the user-defined subsections, only available in custom sorting
    box.subSections.filter(s => s.type === type.toLowerCase()).map((acc) => acc.name).sort()
    //This gets subsections defined by sorting scheme
    : Array.from(new Set(data.map(e => getProperty(e, type, sorting.primarySorting, false) as string))).sort()
  console.log(subSectionNameArr)

  return (
    <AnimateHeight duration={250} height={height}>
      <div className={styles.sectionPanel}>
        <div className={styles.sectionUtilities}>
          <img className={styles.sectionIcon} src={sectionIconSrc} alt="Section icon"></img>
          <span> {type} ({data.length}) </span>
        </div>

        {box.subSections ? 
          <div className={styles.sectionWithSubs}>
            <div className={sorting.primarySorting === "custom" ? styles.defaultSubSection : styles.hidden}>
              <SubSection 
                itemsMatch={sortedData.filter(e => e.subSection === "default")} 
                subName = "default"
                viewType={sorting.view} 
                sectionType={type}
                isDefault={true} 
                page="box" 
                customSorting={sorting.primarySorting === "custom"} 
                toggleModal={toggleModal} 
                boxId={box.id}
              />
            </div>
            {showSubSections(subSectionNameArr)}
          </div>
        : 
          <SubSection 
            itemsMatch={sortedData} 
            subName = "default"
            viewType={sorting.view} 
            sectionType={type}
            isDefault={true} 
            page="box" 
            customSorting={sorting.primarySorting === "custom"} 
            toggleModal={toggleModal} 
            boxId={box.id} 
          />
        }

      </div>
    </AnimateHeight>
  )
}

export default BoxSection;
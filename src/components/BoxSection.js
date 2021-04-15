import React, { useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';

import SubSection from "./box-views/SubSection"
import styles from "./BoxSection.module.css";

function BoxSection(props) {

  const toggleModal = props.toggleModal

  const [height, setHeight] = useState("auto")

  useEffect(() => {
    const heightProp = props.visible ? "auto" : 0
    setHeight(heightProp)
  }, [props.visible])

  function getProperty(item, type, propertyName){
    let property = ""

    switch (propertyName) {
      case "release_date":
        property = type === "Tracks" ? new Date(item.album["release_date"]): new Date(item["release_date"])
      break;
      case "artist":
        property = item.artists[0].name
      break;
      case "name":
        property = item.name
      break;
      case "album":
        property = item.album.name
      break;
      case "duration":
        property = item["duration_ms"]
      break;
      case "track_number":
        property = item["track_number"]
      break;
      default:
    }

    return property
  }

  const twoFactorSort = (array, type, sortFactorOne, sortFactorTwo, ascending) => {
    if (sortFactorOne === "custom") return array
    const sortOrderFactor = ascending ? 1 : -1;

    array.sort((a, b) => {
      const [factorOneInA, factorOneInB] = [getProperty(a, type, sortFactorOne), getProperty(b, type, sortFactorOne)]
      const [factorTwoInA, factorTwoInB] = [getProperty(a, type, sortFactorTwo), getProperty(b, type, sortFactorTwo)]

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

  const showSubSections = (array) => {
    return array.map(s => {
      const itemsMatch = props.sorting.primarySorting === "custom" ? 
        sortedData.filter(e => e.subSection === s) 
        : sortedData.filter(e => getProperty(e, props.type, props.sorting.primarySorting) === s)
      return <SubSection itemsMatch={itemsMatch} page="box" subName={s} viewType={props.sorting.view} toggleModal={toggleModal}/>
    })
  } 

  const sectionIconSrc = `/icons/${props.type.toLowerCase()}.svg`
  const sortedData = twoFactorSort([...props.data], props.type, props.sorting.primarySorting, props.sorting.secondarySorting, props.sorting.ascendingOrder)
  const subSectionList = props.sorting.primarySorting === "custom" ? 
    props.box.subSections.filter(s => s.type === props.type.toLowerCase()).reduce((acc, curr) => [...acc, curr.name], []).sort()
    : Array.from(new Set(props.data.map(e => getProperty(e, props.type, props.sorting.primarySorting))))
  console.log(subSectionList)

  return (
    <AnimateHeight duration={250} height={height}>
      <div className={styles.sectionPanel}>
        <div className={styles.sectionUtilities}>
          <img className={styles.sectionIcon} src={sectionIconSrc} alt="Section icon"></img>
          <span> {props.type} ({props.data.length}) </span>
        </div>

        {props.sorting.subSections ? 
          <div className={styles.sectionWithSubs}>
            <div className={props.sorting.primarySorting === "custom" ? styles.defaultSubSection : styles.hidden}>
              <SubSection 
                itemsMatch={sortedData.filter(e => e.subSection === "default")} 
                viewType={props.sorting.view} 
                default={true} 
                page="box" 
                customSorting={props.sorting.primarySorting === "custom"} 
                toggleModal={toggleModal} 
                boxId={props.box.id}
              />
            </div>
            {showSubSections(subSectionList)}
          </div>
        : 
          <div className={styles.sectionNoSubs}>
            <SubSection 
              itemsMatch={sortedData} 
              viewType={props.sorting.view} 
              default={true} 
              page="box" 
              customSorting={props.sorting.primarySorting === "custom"} 
              toggleModal={toggleModal} 
              boxId={props.box.id} />
          </div>
        }

      </div>
    </AnimateHeight>
  )
}

export default BoxSection;
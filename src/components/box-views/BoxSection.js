import React, { useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';

import SubSection from "./SubSection"
import styles from "./BoxSection.module.css";

function BoxSection(props) {

  const toggleModal = props.toggleModal

  const [height, setHeight] = useState("auto")

  useEffect(() => {
    const heightProp = props.visible ? "auto" : 0
    setHeight(heightProp)
  }, [props.visible])

  function getProperty(item, itemType, propertyName, upperCased){
    let propertyValue = ""

    switch (propertyName) {
      case "release_year":
        propertyValue = itemType === "Tracks" ? parseInt(item.album["release_date"].split("-")[0]) : parseInt(item["release_date"].split("-")[0])
      break;
      case "release_date":
        propertyValue = itemType === "Tracks" ? new Date(item.album["release_date"]) : new Date(item["release_date"])
      break;
      case "artist":
        propertyValue = item.artists[0].name
      break;
      case "name":
        propertyValue = item.name
      break;
      case "album":
        propertyValue = item.album.name
      break;
      case "duration":
        propertyValue = item["duration_ms"]
      break;
      case "track_number":
        propertyValue = item["track_number"]
      break;
      default:
    }

    return typeof propertyValue === "string" && upperCased ? propertyValue.toUpperCase() : propertyValue
  }

  const twoFactorSort = (array, type, sortFactorOne, sortFactorTwo, ascending) => {
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

  const showSubSections = (array) => {
    return array.map(s => {
      const itemsMatch = props.sorting.primarySorting === "custom" ? 
        sortedData.filter(e => e.subSection === s) 
        : sortedData.filter(e => getProperty(e, props.type, props.sorting.primarySorting) === s)
      return <SubSection itemsMatch={itemsMatch} page="box" subName={s} key={s} viewType={props.sorting.view} toggleModal={toggleModal}/>
    })
  } 

  const sectionIconSrc = `/icons/${props.type.toLowerCase()}.svg`
  const sortedData = twoFactorSort([...props.data], props.type, props.sorting.primarySorting, props.sorting.secondarySorting, props.sorting.ascendingOrder)
  const subSectionList = props.sorting.primarySorting === "custom" ? 
    props.box.subSections.filter(s => s.type === props.type.toLowerCase()).reduce((acc, curr) => [...acc, curr.name], []).sort()
    : Array.from(new Set(props.data.map(e => getProperty(e, props.type, props.sorting.primarySorting, false)))).sort()
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
                sectionType={props.type}
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
          <SubSection 
            itemsMatch={sortedData} 
            viewType={props.sorting.view} 
            sectionType={props.type}
            default={true} 
            page="box" 
            customSorting={props.sorting.primarySorting === "custom"} 
            toggleModal={toggleModal} 
            boxId={props.box.id} 
          />
        }

      </div>
    </AnimateHeight>
  )
}

export default BoxSection;
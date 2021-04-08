import React, { useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';

import BoxItem from "./BoxItem"
import DragActions from "./DragActions"
import styles from "./BoxSection.module.css";
import { isPropertyAccessExpression } from 'typescript';

function BoxSection(props) {

  const toggleModal = props.toggleModal

  const [height, setHeight] = useState("auto")
  const [elementDragging, setElementDragging] = useState(false)

  useEffect(() => {
    const heightProp = props.visible ? "auto" : 0
    setHeight(heightProp)
  }, [props.visible])

  const twoFactorSort = (array, type, sortFactorOne, sortFactorTwo, ascending) => {
    if (sortFactorOne === "custom") return array
    const sortOrderFactor = ascending ? 1 : -1;

    array.sort((a, b) => {
      const [factorOneInA, factorOneInB] = getComparables(a, b, type, sortFactorOne)
      const [factorTwoInA, factorTwoInB] = sortFactorTwo ? getComparables(a, b, type, sortFactorTwo) : ["", ""]

      function getComparables(a, b, type, sortFactor){
        let factorInA, factorInB

        switch (sortFactor) {
          case "release_date":
            factorInA = type === "Tracks" ? new Date(a.album["release_date"]): new Date(a["release_date"])
            factorInB = type === "Tracks" ? new Date(b.album["release_date"]): new Date(b["release_date"])
          break;
          case "artist":
            factorInA = a.artists[0].name.toUpperCase()
            factorInB = b.artists[0].name.toUpperCase()
          break;
          case "name":
            factorInA = a.name.toUpperCase()
            factorInB = b.name.toUpperCase()
          break;
          case "album":
            factorInA = a.album.name.toUpperCase()
            factorInB = b.album.name.toUpperCase()
          break;
          case "duration":
            factorInA = a["duration_ms"]
            factorInB = b["duration_ms"]
          break;
          case "track_number":
            factorInA = a["track_number"]
            factorInB = b["track_number"]
          break;
          default:
        }

        return [factorInA, factorInB]
      }

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

  let sectionIconSrc = ""
  let sortedData = []
  let subSectionList = []

  switch (props.type) {
    case "Artists":
      sectionIconSrc = "/icons/artist.svg"
      sortedData = twoFactorSort([...props.data], props.type, props.sorting.primarySorting, undefined, props.sorting.ascendingOrder)
      subSectionList = props.box.subSections.filter(s => s.type === "artist").reduce((acc, curr) => [...acc, curr.name], []).sort()
      console.log(subSectionList)
      break;
    case "Albums":
      sectionIconSrc = "/icons/album.svg"
      sortedData = twoFactorSort([...props.data], props.type, props.sorting.primarySorting, props.sorting.secondarySorting, props.sorting.ascendingOrder)
      subSectionList = props.box.subSections.filter(s => s.type === "album").reduce((acc, curr) => [...acc, curr.name], []).sort()
      break;
    case "Tracks":
      sectionIconSrc = "/icons/song.svg"
      sortedData = twoFactorSort([...props.data], props.type, props.sorting.primarySorting, props.sorting.secondarySorting, props.sorting.ascendingOrder)
      subSectionList = props.box.subSections.filter(s => s.type === "track").reduce((acc, curr) => [...acc, curr.name], []).sort()
      break;
      default:
  }

  return (
    <AnimateHeight duration={250} height={height}>
      <div className={styles.sectionPanel}>
        <div className={styles.sectionUtilities}>
          <img className={styles.sectionIcon} src={sectionIconSrc} alt="Section icon"></img>
          <span> {props.type} ({props.data.length}) </span>
        </div>
        <div className={styles.itemContainer}>
          {sortedData.filter(e => e.subSection === "default").map((e) => {
            return <BoxItem key={e.id} element={e} livesInBox={true} setElementDragging={setElementDragging}/>
          })}
        </div>
        {subSectionList.map(s => {
          const itemsMatch = sortedData.filter(e => e.subSection === s)
          return itemsMatch.length > 0 ? 
          <div className={styles.subSection} key={s}>
            <div className={styles.subSectionName}> {s} </div>
            <div className={styles.itemContainer}>
              {itemsMatch.map((e) => {
                return <BoxItem key={e.id} element={e} livesInBox={true} setElementDragging={setElementDragging}/>
              })}
            </div>
          </div>
          : ""
        })}
      </div>
      <DragActions elementDragging={elementDragging} toggleModal={toggleModal} boxId={props.box.id} />
    </AnimateHeight>
  )
}

export default BoxSection;
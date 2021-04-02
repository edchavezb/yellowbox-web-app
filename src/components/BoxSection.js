import React, { useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';

import SearchItem from "./SearchItem"
import styles from "./BoxSection.module.css";

function BoxSection(props) {

  const [height, setHeight] = useState("auto")

  useEffect(() => {
    const heightProp = props.visible ? "auto" : 0
    setHeight(heightProp)
  }, [props.visible])

  const singleFactorSort = (array, sortFactor, ascending) => {
    if (sortFactor === "custom") return array

    console.log(ascending)

    const sortOrderFactor = ascending ? 1 : -1;

    array.sort((a, b) => {
      if (a[sortFactor].toUpperCase() < b[sortFactor].toUpperCase()) {
        return -1 * sortOrderFactor;
      }
      else if (a[sortFactor].toUpperCase() > b[sortFactor].toUpperCase()) {
        return 1 * sortOrderFactor;
      }
      return 0;
    }) 

    return array
    
  }

  const twoFactorSort = (array, type, sortFactorOne, sortFactorTwo, ascending) => {
    if (sortFactorOne === "custom") return array

    console.log(ascending)

    const sortOrderFactor = ascending ? 1 : -1;

    array.sort((a, b) => {
      let factorOneInA = ""
      let factorOneInB = ""
      let factorTwoInA = ""
      let factorTwoInB = ""

      switch (sortFactorOne) {
        case "release_date":
          factorOneInA = type === "Tracks" ? new Date(a.album["release_date"]): new Date(a["release_date"])
          factorOneInB = type === "Tracks" ? new Date(b.album["release_date"]): new Date(b["release_date"])
        break;
        case "artist":
          factorOneInA = a.artists[0].name.toUpperCase()
          factorOneInB = b.artists[0].name.toUpperCase()
        break;
        case "name":
          factorOneInA = a.name.toUpperCase()
          factorOneInB = b.name.toUpperCase()
        break;
        case "album":
          factorOneInA = a.album.name.toUpperCase()
          factorOneInB = b.album.name.toUpperCase()
        break;
        case "duration":
          factorOneInA = a["duration_ms"]
          factorOneInB = b["duration_ms"]
        break;
        case "track_number":
          factorOneInA = a["track_number"]
          factorOneInB = b["track_number"]
        break;
      }

      switch (sortFactorTwo) {
        case "release_date":
          factorTwoInA = type === "Tracks" ? new Date(a.album["release_date"]): new Date(a["release_date"])
          factorTwoInB = type === "Tracks" ? new Date(b.album["release_date"]): new Date(b["release_date"])
        break
        case "artist":
          factorTwoInA = a.artists[0].name.toUpperCase()
          factorTwoInB = b.artists[0].name.toUpperCase()
        break
        case "name":
          factorTwoInA = a.name.toUpperCase()
          factorTwoInB = b.name.toUpperCase()
        break
        case "album":
          factorOneInA = a.album.name.toUpperCase()
          factorOneInB = b.album.name.toUpperCase()
        break;
        case "duration":
          factorOneInA = a["duration_ms"]
          factorOneInB = b["duration_ms"]
        break;
        case "track_number":
          factorOneInA = a["track_number"]
          factorOneInB = b["track_number"]
        break;
      }

      if (factorOneInA < factorOneInB) return -1 * sortOrderFactor;
      else if (factorOneInA > factorOneInB) return 1 * sortOrderFactor; 
      else {
        
        if(factorTwoInA < factorTwoInB) return -1 * sortOrderFactor;
        else if (factorTwoInA > factorTwoInB) return 1 * sortOrderFactor;
        return 0

      }
    }) 

    return array

  }

  let sectionIconSrc = ""
  let sortedData = []

  switch (props.type) {
    case "Artists":
      sectionIconSrc = "/icons/artist.svg"
      sortedData = singleFactorSort([...props.data], props.sorting.primarySorting, props.sorting.ascendingOrder)
      break;
    case "Albums":
      sectionIconSrc = "/icons/album.svg"
      sortedData = twoFactorSort([...props.data], props.type, props.sorting.primarySorting, props.sorting.secondarySorting, props.sorting.ascendingOrder)
      break;
    case "Tracks":
      sectionIconSrc = "/icons/song.svg"
      sortedData = twoFactorSort([...props.data], props.type, props.sorting.primarySorting, props.sorting.secondarySorting, props.sorting.ascendingOrder)
      break;
  }

  return (
    <AnimateHeight duration={250} height={height}>
      <div className={styles.sectionPanel}>
        <div className={styles.sectionUtilities}>
          <img className={styles.sectionIcon} src={sectionIconSrc}></img>
          <span> {props.type} ({props.data.length}) </span>
        </div>
        <div className={styles.itemContainer}>
          {sortedData.map((e) => {
            return <SearchItem key={e.id} element={e} />
          })}
        </div>
      </div>
    </AnimateHeight>
  )
}

export default BoxSection;
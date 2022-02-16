import React, { useState, useEffect } from 'react';

import GridView from "./GridView"
import ListView from "./ListView"
import DetailView from "./DetailView"
import styles from "./SubSection.module.css";

function SubSection(props) {
  const itemsMatch = props.itemsMatch
  const subName = props.subName
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
    switch (props.viewType){
      case "grid":
        sectionView = <GridView data={data} page={page} customSorting={isCustom} toggleModal={props.toggleModal} boxId={props.boxId} />
      break;
      case "list":
        sectionView = <ListView listType={getListType(props.sectionType)} data={data} page={page} customSorting={isCustom} toggleModal={props.toggleModal} boxId={props.boxId} />
      break;
      case "detail":
        sectionView = <DetailView data={data} page={page} customSorting={isCustom} toggleModal={props.toggleModal} boxId={props.boxId} />
      break;
      default:
    }
    return sectionView
  }

  return (itemsMatch.length > 0 ?
    <div className={styles.subSectionWrapper} key={subName}>
      {!props.default ? <div className={styles.subSectionName}> {subName} </div> : "" }
        {displayView(itemsMatch, props.page, props.customSorting)}
    </div>
    : "")
}

export default SubSection;
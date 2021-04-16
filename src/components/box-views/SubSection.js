import React, { useState, useEffect } from 'react';

import GridView from "./GridView"
import ListView from "./ListView"
import DetailView from "./DetailView"
import styles from "./SubSection.module.css";

function SubSection(props) {
  const itemsMatch = props.itemsMatch
  const subName = props.subName
  console.log(itemsMatch)

  const displayView = (data, page, isCustom) => {
    let sectionView = ""
    switch (props.viewType){
      case "grid":
        sectionView = <GridView data={data} page={page} customSorting={isCustom} toggleModal={props.toggleModal} boxId={props.boxId} />
      break;
      case "list":
        sectionView = <ListView data={data} page={page} customSorting={isCustom} toggleModal={props.toggleModal} boxId={props.boxId} />
      break;
      case "detail":
        sectionView = <DetailView data={data} page={page} customSorting={isCustom} toggleModal={props.toggleModal} boxId={props.boxId} />
      break;
      default:
    }
    return sectionView
  }

  return (itemsMatch.length > 0 ?
    <div className={styles.subSection} key={subName}>
      {!props.default ? <div className={styles.subSectionName}> {subName} </div> : "" }
        {displayView(itemsMatch, props.page, props.customSorting)}
    </div>
    : "")
}

export default SubSection;
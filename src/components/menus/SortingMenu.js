import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styles from "./SortingMenu.module.css";

function SortingMenu(props) {

  const toggleModal = props.toggleModal;
  const dispatch = props.dispatch;
  const targetIndex = props.userBoxes.findIndex(box => box.id === props.boxId)
  const boxCopy = JSON.parse(JSON.stringify(props.userBoxes.find(box => box.id === props.boxId)))
  const boxSections = {artists: boxCopy.artists, albums: boxCopy.albums, tracks: boxCopy.tracks}
  const nonEmptySections = Object.keys(boxSections).filter((section) => boxSections[section].length > 0)
  const boxSorting = boxCopy.sectionSorting

  const [sorting, setSorting] = useState({...boxSorting})

  const handleUpdateSorting = () => {
    const updatedBox = {
      ...boxCopy,
      sectionSorting: sorting
    }
    console.log(boxCopy)
    console.log(updatedBox)
    dispatch({ type: "UPDATE_BOX", payload: { updatedBox: updatedBox, target: targetIndex }})
    toggleModal({ visible: false, type: "", boxId:"" })
  }

  useEffect(() => {
    console.log(sorting)
  }, [sorting]) 

  return (
    <div id={styles.modalBody}>
      <form id={styles.sortingForm}>
        {nonEmptySections.map(section => {
          return (
            <div className={styles.sortingRow} key={section}> 

              <span className={styles.rowNameSpan}> {section.charAt(0).toUpperCase() + section.slice(1)} </span>

              <div className={styles.formInput}>
                <label htmlFor="view"> View as </label>
                <select name="view" defaultValue={boxSorting[section].view}  
                  onChange={e => {
                    let sectionCopy = JSON.parse(JSON.stringify(sorting[section]))
                    let updatedSection = {...sectionCopy, view: e.target.value}
                    let newSortingObject = {}
                    newSortingObject[section] = updatedSection
                    console.log(newSortingObject)
                    setSorting(state => ({...state, ...newSortingObject})) 
                  }}> 
                    <option value="grid"> Grid </option> 
                    {section !== "artists" ? <option value="list"> List </option> : ""}
                    <option value="details"> Details </option>
                </select>
              </div>

              <div className={styles.formInput}>
                <label htmlFor="sorting"> Sort by </label>
                <select name="sorting" defaultValue={boxSorting[section].primarySorting}
                  onChange={e => {
                    let sectionCopy = JSON.parse(JSON.stringify(sorting[section]))
                    console.log(sectionCopy)
                    let updatedSection = {...sectionCopy, primarySorting: e.target.value}
                    console.log(updatedSection)
                    let newSortingObject = {}
                    newSortingObject[section] = updatedSection
                    console.log(newSortingObject)
                    setSorting(state => ({...state, ...newSortingObject})) 
                    if (section !== "artists") e.target.closest("div").nextElementSibling.querySelector(".sec-sorting").selectedIndex = 0
                  }}> 
                  <option value="custom"> Custom </option>
                  {section === "artists" ? <option value="name"> Name </option> : ""}
                  {section !== "artists" ? <option value="name"> Title </option> : ""}
                  {section !== "artists" ? <option value="release_year"> Release Year </option> : ""}
                  {section !== "artists" ? <option value="artist"> Artist </option> : ""}
                  {section === "tracks" ? <option value="album"> Album </option> : ""}
                  {section === "tracks" ? <option value="duration"> Duration </option> : ""}
                  {section === "tracks" ? <option value="track_number"> Track Number </option> : ""}
                </select> 
              </div>
              
              <div className={styles.formInput}>
                <label htmlFor="sec-sorting"> then by </label>
                <select className="sec-sorting" name="sec-sorting" disabled={sorting[section].primarySorting === "custom"} defaultValue={boxSorting[section].secondarySorting}
                  onChange={e => {
                    let sectionCopy = JSON.parse(JSON.stringify(sorting[section]))
                    let updatedSection = {...sectionCopy, secondarySorting: e.target.value}
                    let newSortingObject = {}
                    newSortingObject[section] = updatedSection
                    console.log(newSortingObject)
                    setSorting(state => ({...state, ...newSortingObject})) 
                  }}
                  >
                  <option value="none" disabled hidden> Select... </option> 
                  {section === "artists" ? <option value="name" hidden={sorting[section].primarySorting === "name"}> Name </option> : ""}
                  {section !== "artists" ? <option value="name" hidden={sorting[section].primarySorting === "name"}> Title </option> : ""}
                  {section !== "artists" ? <option value="release_year" hidden={sorting[section].primarySorting === "release_year"}> Release Year </option> : ""}
                  {section !== "artists" ? <option value="release_date" hidden={sorting[section].primarySorting === "release_date"}> Release Date </option> : ""}
                  {section !== "artists" ? <option value="artist" hidden={sorting[section].primarySorting === "artist"}> Artist </option> : ""}
                  {section !== "albums" ? <option value="popularity" hidden={sorting[section].primarySorting === "popularity"}> Popularity </option> : ""}
                  {section === "tracks" ? <option value="album" hidden={sorting[section].primarySorting === "album"}> Album </option> : ""}
                  {section === "tracks" ? <option value="duration" hidden={sorting[section].primarySorting === "duration"}> Duration </option> : ""}
                  {section === "tracks" ? <option value="track_number" hidden={sorting[section].primarySorting === "track_number"}> Track Number </option> : ""}
                </select> 
              </div>

              <div className={styles.formInput}>
                <label htmlFor="order"> Order </label>
                <select name="order" defaultValue={boxSorting[section].ascendingOrder.toString()} disabled={sorting[section].primarySorting === "custom"}
                  onChange={e => {
                    const booleanValue = e.target.value === "true"
                    let sectionCopy = JSON.parse(JSON.stringify(sorting[section]))
                    let updatedSection = {...sectionCopy, ascendingOrder: booleanValue}
                    let newSortingObject = {}
                    newSortingObject[section] = updatedSection
                    console.log(newSortingObject)
                    setSorting(state => ({...state, ...newSortingObject})) 
                  }}
                  > 
                  <option value="true"> Ascending </option>
                  <option value="false"> Descending </option>
                </select>
              </div>
              

              <div className={styles.formInput}>
                <input type="checkbox" name="sub-section" defaultChecked={boxSorting[section].subSections}
                  onChange={e => {
                    console.log(e.target.checked)
                    let sectionCopy = JSON.parse(JSON.stringify(sorting[section]))
                    let updatedSection = {...sectionCopy, subSections: e.target.checked}
                    let newSortingObject = {}
                    newSortingObject[section] = updatedSection
                    console.log(newSortingObject)
                    setSorting(state => ({...state, ...newSortingObject})) 
                  }}
                />
                <label htmlFor="sub-section"> Show sub-sections </label>
              </div>

            </div>
          )
        })}
      </form>
      <div id={styles.modalFooter}>
        <button onClick={() => handleUpdateSorting()}> Save settings </button>
      </div>
    </div>
  )
}

export default SortingMenu;
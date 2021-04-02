import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styles from "./SortingMenu.module.css";

function SortingMenu(props) {

  const toggleModal = props.toggleModal;
  const dispatch = props.dispatch;
  const targetIndex = props.userBoxes.findIndex(box => box.id === props.boxId)
  const boxCopy = {...props.userBoxes.find(box => box.id === props.boxId)}
  const boxSections = {artists: boxCopy.artists, albums: boxCopy.albums, tracks: boxCopy.tracks}
  const nonEmptySections = Object.keys(boxSections).filter((section) => boxSections[section].length > 0)

  const [primSorting, setPrimSorting] = useState({artists: boxCopy.primarySorting.artists, albums: boxCopy.primarySorting.albums, tracks: boxCopy.primarySorting.tracks})
  const [secSorting, setSecSorting] = useState({albums: boxCopy.secondarySorting.albums, tracks: boxCopy.secondarySorting.tracks})
  const [view, setView] = useState({artists: boxCopy.view.artists, albums: boxCopy.view.albums, tracks: boxCopy.view.tracks})

  const handleUpdateSorting = () => {
    const updatedBox = {
      ...boxCopy,
      primarySorting: primSorting,
      secondarySorting: secSorting,
      view: view,
    }
    console.log(boxCopy)
    console.log(updatedBox)
    dispatch({ type: "UPDATE_BOX", payload: { updatedBox: updatedBox, target: targetIndex }})
    toggleModal({ visible: false, type: "", boxId:"" })
  }

  useEffect(() => {
    console.log(primSorting)
    console.log(secSorting)
    console.log(view)
  }, [primSorting, secSorting, view]) 

  return (
    <div id={styles.modalBody}>
      <form id={styles.sortingForm}>
        {nonEmptySections.map(section => {
          return (
            <div className={styles.sortingRow} key={section}> 

              <span> {section.charAt(0).toUpperCase() + section.slice(1)} </span>

              <label htmlFor="view"> View as </label>
              <select name="view" defaultValue={boxCopy.view[section]} 
                onChange={e => {
                  let newView = {}
                  newView[section] = e.target.value
                  console.log(newView)
                  setView(state => ({...state, ...newView})) 
                }}> 
                  <option value="grid"> Grid </option>
                  <option value="list"> List </option>
                  <option value="details"> Details </option>
              </select>

              <label htmlFor="sorting"> Sort by </label>
              <select name="sorting" defaultValue={boxCopy.primarySorting[section]}
                onChange={e => {
                  let newSorting = {}
                  newSorting[section] = e.target.value
                  setPrimSorting(state => ({...state, ...newSorting}))
                  if (section !== "artists") e.target.closest("div").querySelector(".sec-sorting").selectedIndex = 0
                }}> 
                <option value="custom"> Custom </option>
                {section === "artists" ? <option value="name"> Name </option> : ""}
                {section !== "artists" ? <option value="name"> Title </option> : ""}
                {section !== "artists" ? <option value="release_date"> Release Date </option> : ""}
                {section !== "artists" ? <option value="artist"> Artist </option> : ""}
              </select> 
              
              {section !== "artists" ? 
              <div>
                <label htmlFor="sec-sorting"> then by </label>
                <select className="sec-sorting" name="sec-sorting" disabled={primSorting[section] === "custom"} defaultValue={boxCopy.secondarySorting[section]}
                  onChange={e => {
                    let newSorting = {}
                    newSorting[section] = e.target.value
                    setSecSorting(state => ({...state, ...newSorting}))
                  }}
                  >
                  <option value="none" disabled hidden> Select... </option> 
                  <option value="name" disabled={primSorting[section] === "name"} hidden={primSorting[section] === "name"}> Title </option>
                  <option value="release_date" disabled={primSorting[section] === "release_date"} hidden={primSorting[section] === "release_date"}> Release Date </option>
                  <option value="artist" disabled={primSorting[section] === "artist"} hidden={primSorting[section] === "artist"}> Artist </option>
                </select> 
              </div>
              : ""}

              <input type="checkbox" name="sub-section"></input>
              <label htmlFor="sub-section"> Show sub-sections </label>

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
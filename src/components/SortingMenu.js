import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styles from "./SortingMenu.module.css";

function SortingMenu(props) {

  const toggleModal = props.toggleModal;
  const dispatch = props.dispatch;
  const box = props.userBoxes.find(box => box.id === props.boxId)
  const boxSections = {artists: box.artists, albums: box.albums, tracks: box.tracks}
  const nonEmptySections = Object.keys(boxSections).filter((section) => boxSections[section].length > 0)

  console.log(nonEmptySections)

  const handleUpdateSorting = () => {
    console.log("Hi, I love you")
  }

  return (
    <div id={styles.modalBody}>
      <form id={styles.sortingForm}>
        {nonEmptySections.map(section => {
          return (
            <div className={styles.sortingRow}> 
              <span> {section.charAt(0).toUpperCase() + section.slice(1)} </span>
              <label htmlFor="view"> View as </label>
              <select name="view"> 
                <option> Grid </option>
                <option> List </option>
              </select>
              <label htmlFor="sorting"> Sorting </label>
              <select name="sorting"> 
                <option> Custom </option>
                <option> Name </option>
                {section !== "artists" ? <option> Release Year </option> : ""}
              </select> 
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
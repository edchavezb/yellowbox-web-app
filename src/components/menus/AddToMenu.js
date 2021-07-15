import React, { useState, useEffect } from 'react';

import styles from "./AddToMenu.module.css";

function AddToMenu(props) {

  const toggleModal = props.toggleModal;
  const dispatch = props.dispatch;
  const userBoxes = props.userBoxes
  const currentBox = {...props.userBoxes.find(box => box.id === props.boxId)}
  const itemData = JSON.parse(JSON.stringify(props.itemData))

  const [addType, setAddType] = useState("box")
  const [addBox, setAddBox] = useState(userBoxes[0].id)
  const [addSub, setAddSub] = useState(props.page === "box" && currentBox.subSections.length ? currentBox.subSections[0].name : "")

  useEffect(() => {
    console.log(addType)
  }, [addType])

  const handleAddItem = () => {
    const targetId = addType === "box" ? addBox : currentBox.id
    const targetIndex = userBoxes.findIndex(box => box.id === targetId)
    const targetBox = {...userBoxes.find(box => box.id === targetId)}
    console.log(targetBox)
    const updatedItem = {...itemData, subSection: addType === "box" ? "default" : addSub}
    let updatedBox = {}
    switch (itemData.type) {
      case "album" :
        const updatedAlbums = [...targetBox.albums.filter(a => a.id !== updatedItem.id), updatedItem]
        updatedBox = {...targetBox, albums: updatedAlbums}
      break;
      case "artist" :
        const updatedArtists = [...targetBox.artists.filter(a => a.id !== updatedItem.id), updatedItem]
        updatedBox = {...targetBox, artists: updatedArtists}
      break;
      case "track" :
        const updatedTracks = [...targetBox.tracks.filter(a => a.id !== updatedItem.id), updatedItem]
        updatedBox = {...targetBox, tracks: updatedTracks}
      break;
      default :
    }
    console.log("Dispatch call")
    dispatch({type: "UPDATE_BOX", payload: {updatedBox: updatedBox, target: targetIndex}})
    toggleModal({ visible: false, type: "", boxId:"", itemData: ""})
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <label htmlFor="add-type"> Add this item to </label>
        <select name="add-type" defaultValue={addType} onChange={(e) => setAddType(e.target.value)}>
          <option value="box"> another box in your collection </option>
          <option value="subsection" hidden={props.page === "search"} > a sub-section of this box </option>
        </select>
      </div>

      {addType === "box" ? 
        <div id={styles.boxSelect}>
          <label htmlFor="box-select"> Select a box </label>
          <select name="box-select" defaultValue={userBoxes[0].id} onChange={(e) => setAddBox(e.target.value)}>
            {userBoxes.map(box => {
              return (<option key={box.id} value={box.id}> {box.name} </option>)
            })}
          </select>
        </div>
        : ""
      }

      {addType === "subsection" ? 
        <div id={styles.subSectionSelect}>
          <label htmlFor="subsection-select"> Select a subsection </label>
          <select name="subsection-select" defaultValue={currentBox.subSections[0].name} onChange={(e) => setAddSub(e.target.value)}>
            {currentBox.subSections.map(sub => {
              return (<option key={sub.name} value={sub.name}> {sub.name} </option>)
            })}
          </select>
        </div>
        : ""
      }

      <div id={styles.modalFooter}>
        <button onClick={() => handleAddItem()}> Add item </button>
      </div>
    </div>
  )
}

export default AddToMenu;
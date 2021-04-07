import React, { useState, useEffect } from 'react';

import styles from "./AddToMenu.module.css";

function AddToMenu(props) {

  const toggleModal = props.toggleModal;
  const dispatch = props.dispatch;
  const userBoxes = props.userBoxes
  const itemData = props.itemData
  let sectionType

  switch(itemData.type){
    case "artist":
      sectionType = "artists"
    break;
    case "album":
      sectionType = "albums"
    break;
    case "track":
      sectionType = "tracks"
    break;
  }

  const [addType, setAddType] = useState("box")
  const [addTarget, setAddTarget] = useState("")

  useEffect(() => {
    console.log(addType, userBoxes)
  }, [addType])

  const handleAddItemToSection = () => {
    const targetIndex = props.userBoxes.findIndex(box => box.id === props.boxId)
    const targetBox = {...props.userBoxes.find(box => box.id === props.boxId)}
    const targetSection = targetBox[sectionType]
    const filteredSection = targetSection.filter(item => item.id !== itemData.id)
    let updatedBox = JSON.parse(JSON.stringify(targetBox))
    updatedBox[sectionType] = filteredSection
    dispatch({ type: "UPDATE_BOX", payload: { updatedBox: updatedBox, target: targetIndex } })
    toggleModal({ visible: false, type: "", boxId:"", itemData: ""})
  }

  return (
    <div id={styles.modalBody}>
      <div id={styles.confirmation}>
        <label htmlFor="add-type"> Add this item to </label>
        <select name="add-type" defaultValue={addType} onChange={(e) => setAddType(e.target.value)}>
          <option value="box"> another box in your collection </option>
          <option value="subsection"> a sub-section of this box </option>
        </select>
      </div>
      {addType === "box" ? 
        <div id={styles.boxSelect}>
          <label htmlFor="box-select"> Select a box </label>
          <select name="box-select" defaultValue={addType} onChange={(e) => setAddTarget(e.target.value)}>
            {userBoxes.map(box => {
              return (<option key={box.id} value={box.id}> {box.name} </option>)
            })}
          </select>
        </div>
        :
        <div id={styles.subSectionSelect}>
          <label htmlFor="subsection-select"> Select a subsection </label>
          <select name="subsection-select" defaultValue={addType} onChange={(e) => setAddTarget(e.target.value)}>
            <option value="new" new="true" > create a new sub-section </option>
          </select>
        </div>
      }
      <div id={styles.modalFooter}>
        <button onClick={() => handleAddItemToSection()}> Add item </button>
      </div>
    </div>
  )
}

export default AddToMenu;
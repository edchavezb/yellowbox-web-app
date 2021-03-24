import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import styles from "./SideBar.module.css";

function SideBar(props) {

  const dispatch = props.dispatch;

  const addToBox = (draggedData, targetBoxId) => {
    const targetIndex = props.boxes.findIndex(box => box.id === targetBoxId)
    const targetBox = {...props.boxes.find(box => box.id === targetBoxId)}
    let updatedBox = {}
    switch (draggedData.type) {
      case "album" :
        const updatedAlbums = [...targetBox.albums, draggedData]
        updatedBox = {...targetBox, albums: updatedAlbums}
      break;
      case "artist" :
        const updatedArtists = [...targetBox.artists, draggedData]
        updatedBox = {...targetBox, artists: updatedArtists}
      break;
      case "track" :
        const updatedTracks = [...targetBox.tracks, draggedData]
        updatedBox = {...targetBox, tracks: updatedTracks}
      break;
    }
    console.log("Dispatch call")
    dispatch({type: "UPDATE_BOX", payload: {updatedBox: updatedBox, target: targetIndex}})
  }

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.className = styles.linkDragOver
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.className = styles.boxLink
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.className = styles.boxLink
    const data = JSON.parse(e.dataTransfer.getData("data"))
    console.log(data)
    console.log(e.currentTarget.id)
    addToBox(data, e.currentTarget.id)
  }

  return (
    <div id={styles.mainPanel}>
      <div id={styles.user}>
        <img id={styles.userImage} src="/user.png" alt="user" />
        <span id={styles.userName}> {props.userName} </span>
      </div>
      <div id={styles.boxList}>
        <h4 id={styles.boxesTitle}> Your Boxes </h4>
        {props.boxes.map((box) => {
          return (
            <Link className={styles.boxLink} id={box.id} key={box.id} to={`/box/${box.id}`} 
              onDragEnter={(e) => handleDragEnter(e)} 
              onDragLeave={(e) => handleDragLeave(e)}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e)}>
                <span> {box.name} </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default SideBar;
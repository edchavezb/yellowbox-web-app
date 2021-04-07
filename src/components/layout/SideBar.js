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

  const extractCrucialData = (data) => {
    let extractedData = {}
    switch(data.type){
      case "artist" : {
        const {external_urls, id, images, name, popularity, type, uri} = data
        extractedData = {external_urls, id, images, name, popularity, type, uri}
      break;
      }
      case "album" : {
        const {album_type, artists, external_urls, id, images, name, release_date, type, uri} = data
        extractedData = {album_type, artists, external_urls, id, images, name, release_date, type, uri}
      break;
      }
      case "track" : {
        const {album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri} = data
        extractedData = {album, artists, duration_ms, explicit, external_urls, id, name, popularity, preview_url, track_number, type, uri}
      break;
      }
      default :
        extractedData = data
    }
    return extractedData
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
    const crucialData = extractCrucialData(data)
    console.log(data)
    console.log(e.currentTarget.id)
    addToBox(crucialData, e.currentTarget.id)
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
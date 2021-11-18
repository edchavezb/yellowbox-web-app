import React, { useState, useEffect } from 'react';

import ListItemTrack from "./ListItemTrack"
import ListItemAlbum from "./ListItemAlbum"
import ListItemPlaylist from "./ListItemPlaylist"
import DragActions from "../DragActions"
import styles from "./ListView.module.css";

function ListView(props) {

  const [elementDragging, setElementDragging] = useState(false)

  useEffect(() => console.log(props.data), [props.data]);

  const getListHeader = () => {
    let listHeader;
    switch(props.listType){
      case "track":
        listHeader =
        <div className={styles.trackListHeader}>
          <div className={styles.headerLeftAlgn}> # </div> 
          <div className={styles.headerLeftAlgn}> Title </div> 
          <div className={styles.headerLeftAlgn}> Artist </div> 
          <div className={styles.headerLeftAlgn}> Album </div> 
          <div className={styles.headerCentered}> Duration </div> 
          <div className={styles.headerCentered}> Lyrics </div> 
          <div className={styles.headerCentered}> Spotify </div>
        </div> ;
      break;
      case "album":
        listHeader =
        <div className={styles.albumListHeader}>
          <div className={styles.headerLeftAlgn}> # </div> 
          <div className={styles.headerLeftAlgn}> Title </div> 
          <div className={styles.headerLeftAlgn}> Artist </div> 
          <div className={styles.headerCentered}> Type </div> 
          <div className={styles.headerCentered}> Year </div> 
          <div className={styles.headerCentered}> Spotify </div>
        </div> ;
      break;
      case "playlist":
        listHeader =
        <div className={styles.playlistListHeader}>
          <div className={styles.columnHeader}> # </div> 
          <div className={styles.columnHeader}> Name </div> 
          <div className={styles.columnHeader}> Creator </div> 
          <div className={styles.columnHeader}> Tracks </div> 
          <div className={styles.columnHeader}> Description </div> 
          <div className={styles.columnHeader}> Spotify </div>
        </div>;
      break;
      default:
        listHeader = <div></div>;
      break;
    }
    return listHeader;
  }

  const getListItemComponent = (e) => {
    let itemComponent;
    switch(props.listType){
      case "track":
        itemComponent = <ListItemTrack key={e.id} index={props.data.indexOf(e)} element={e} page={props.page} setElementDragging={setElementDragging} />
      break;
      case "album":
        itemComponent = <ListItemAlbum key={e.id} index={props.data.indexOf(e)} element={e} page={props.page} setElementDragging={setElementDragging} />
      break;
      case "playlist":
        itemComponent = <ListItemPlaylist key={e.id} index={props.data.indexOf(e)} element={e} page={props.page} setElementDragging={setElementDragging} />
      break;
      default:
        itemComponent = <ListItemTrack key={e.id} index={props.data.indexOf(e)} element={e} page={props.page} setElementDragging={setElementDragging} />
      break;
    }
    return itemComponent;
  }

  return (
    <div className={styles.itemContainer}>
      {getListHeader()}
      {props.data.map((element) => {
          return getListItemComponent(element)
      })}
      <DragActions elementDragging={elementDragging} toggleModal={props.toggleModal} boxId={props.boxId} />
    </div>
  )
}

export default ListView;
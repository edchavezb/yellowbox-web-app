import React, { useState, useEffect } from 'react';

import GridItem from "./GridItem"
import DetailRowTrack from "./detail-row/DetailRowTrack"
import DetailRowAlbum from "./detail-row/DetailRowAlbum"
import DetailRowPlaylist from "./detail-row/DetailRowPlaylist"
import DragActions from "../layout/DragActions"
import styles from "./DetailView.module.css";

function DetailView(props) {
  const [elementDragging, setElementDragging] = useState(false)

  useEffect(() => console.log("Detail view", props.data), [props.data]);

  console.log("Detail view component");

  const getListItemComponent = (e) => {
    let itemComponent;
    switch(props.listType){
      case "tracklist":
        itemComponent = <DetailRowTrack key={e.id} index={props.data.indexOf(e)} element={e} page={props.page} setElementDragging={setElementDragging} />
      break;
      case "albumlist":
        itemComponent = <DetailRowAlbum key={e.id} index={props.data.indexOf(e)} element={e} page={props.page} setElementDragging={setElementDragging} />
      break;
      case "playlists":
        itemComponent = <DetailRowPlaylist key={e.id} index={props.data.indexOf(e)} element={e} page={props.page} setElementDragging={setElementDragging} />
      break;
      default:
        itemComponent = <DetailRowTrack key={e.id} index={props.data.indexOf(e)} element={e} page={props.page} setElementDragging={setElementDragging} />
      break;
    }
    return itemComponent;
  }

  return (
    <div className={styles.itemContainer}>
      {props.data.map((element) => {
          return getListItemComponent(element)
      })}
      <DragActions elementDragging={elementDragging} toggleModal={props.toggleModal} boxId={props.boxId} />
    </div>
  )
}

export default DetailView;
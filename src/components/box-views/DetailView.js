import React, { useState, useEffect } from 'react';

import GridItem from "./GridItem"
import DetailRowTrack from "./detail-row/DetailRowTrack"
import DetailRowAlbum from "./detail-row/DetailRowAlbum"
import DetailRowPlaylist from "./detail-row/DetailRowPlaylist"
import DetailItem from './DetailItem';
import DragActions from "../layout/DragActions"
import styles from "./DetailView.module.css";

function DetailView(props) {
  const [elementDragging, setElementDragging] = useState(false)

  return (
    <div className={styles.itemContainer}>
      {props.data.map((e) => {
          return <DetailItem key={e.id} index={props.data.indexOf(e)} element={e} page={props.page} setElementDragging={setElementDragging} />
      })}
      <DragActions elementDragging={elementDragging} toggleModal={props.toggleModal} boxId={props.boxId} />
    </div>
  )
}

export default DetailView;
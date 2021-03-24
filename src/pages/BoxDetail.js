import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SearchResults from "../components/SearchResults"
import styles from "./BoxDetail.module.css";

function BoxDetail(props) {

  console.log(props.userBoxes)
  const params = useParams()
  const box = props.userBoxes.find(box => box.id === params.id)

  return (
    <div id={styles.mainPanel}>
      <h2> {box.name} </h2>
      <SearchResults type="Artists" data={box.artists}/>
      <SearchResults type="Albums" data={box.albums}/>
      <SearchResults type="Tracks" data={box.tracks}/>
    </div>
  )
}

export default BoxDetail;
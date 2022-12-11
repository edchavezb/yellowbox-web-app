//import React, { useState, useEffect } from 'react';
import GridView from "../components/box-views/GridView"
import styles from "./SearchResults.module.css";
import { Album, Artist, Playlist, Track } from '../core/types/interfaces';

interface IProps<T> {
	data: T[]
  type: string
}

function SearchResults<T extends Artist | Album | Track | Playlist>({data, type}: IProps<T>) {

  return (
    <div className={styles.resultsSection}>
      <h3> {`${type}`} </h3>
      <GridView<T> data={data} page="search" customSorting={false} boxId={undefined} />
    </div>
  )
}

export default SearchResults;
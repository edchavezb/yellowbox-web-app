//import React, { useState, useEffect } from 'react';
import GridView from "../components/box-views/GridView"
import styles from "./SearchResults.module.css";
import { Album, Artist, ModalState, Playlist, Track } from '../interfaces';
import { Dispatch, SetStateAction } from "react";

interface IProps<T> {
	data: T[]
  type: string
  toggleModal: Dispatch<SetStateAction<ModalState>>
}

function SearchResults<T extends Artist | Album | Track | Playlist>({data, type, toggleModal}: IProps<T>) {

  return (
    <div className={styles.resultsSection}>
      <h3> {`${type}`} </h3>
      <GridView<T> data={data} page="search" customSorting={false} toggleModal={toggleModal} boxId={undefined} />
    </div>
  )
}

export default SearchResults;
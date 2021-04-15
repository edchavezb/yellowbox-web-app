import React, { useState, useEffect } from 'react';

import GridView from "./box-views/GridView"
import styles from "./SearchResults.module.css";

function SearchResults(props) {

  return (
    <div className={styles.resultsPanel}>
      <h3> {props.type} </h3>
      <div className={styles.resultsContainer}>
        <GridView data={props.data} page="search" customSorting={false} toggleModal={props.toggleModal} boxId={undefined} />
      </div>
    </div>
  )
}

export default SearchResults;
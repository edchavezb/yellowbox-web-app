import React, { useState, useEffect } from 'react';

import GridItem from "./box-views/GridItem"
import styles from "./SearchResults.module.css";

function SearchResults(props){
    
    return (
        <div className={styles.resultsPanel}>
            <h3> {props.type} </h3> 
            <div className={styles.resultsContainer}>
                {props.data.map((e) => {
                    return <GridItem key={e.id} element={e}/>
                })}
            </div>
        </div>
    )
}

export default SearchResults;
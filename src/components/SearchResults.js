import React, { useState, useEffect } from 'react';

import SearchItem from "./BoxItem"
import styles from "./SearchResults.module.css";

function SearchResults(props){
    
    return (
        <div className={styles.resultsPanel}>
            <h3> {props.type} </h3> 
            <div className={styles.resultsContainer}>
                {props.data.map((e) => {
                    return <SearchItem key={e.id} element={e}/>
                })}
            </div>
        </div>
    )
}

export default SearchResults;
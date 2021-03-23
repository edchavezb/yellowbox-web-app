import React, { useState, useEffect } from 'react';
import styles from "./SearchItem.module.css";

function SearchItem(props){
    const elementImages = props.element.type === "track" ? props.element.album.images : props.element.images
    const itemCoverArt = elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"
    const artistName = props.element.type === "artist" ? "" : <div className={styles.artistName}> {props.element.artists[0].name} </div>

    return (
        <div className={styles.itemCard}>
            <div className={styles.imageContainer}>
                <img className={styles.itemImage} src={itemCoverArt}></img>
            </div>
            <div className={styles.name}> {props.element.name} </div>
            {artistName}
        </div>
    )
}

export default SearchItem;
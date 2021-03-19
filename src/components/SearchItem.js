import React, { useState, useEffect } from 'react';
import styles from "./SearchItem.module.css";

function SearchItem(props){
    const elementImages = props.element.type === "track" ? props.element.album.images : props.element.images
    const itemCoverArt = elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"
    console.log(props.element.type, itemCoverArt)

    return (
        <div className={styles.itemCard}>
            <img className={styles.itemImage} src={itemCoverArt}></img>
            <div> {props.element.name} </div>
        </div>
    )
}

export default SearchItem;
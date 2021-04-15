import React, { useState, useEffect } from 'react';
import styles from "./GridItem.module.css";

function GridItem(props){
    const elementImages = props.element.type === "track" ? props.element.album.images : props.element.images
    const itemCoverArt = elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"
    const artistName = props.element.type === "artist" ? "" 
        : <div className={styles.artistName}> {props.element.artists[0].name} </div>

    const handleDrag = (e, data) => {
        console.log(data)
        e.dataTransfer.setData("data", JSON.stringify(data))
        props.setElementDragging(true)
    }

    const handleDragEnd = () => {
        props.setElementDragging(false)
    }

    return (
        <div draggable onDragStart={(e) => handleDrag(e, props.element)} onDragEnd={() => handleDragEnd()} className={styles.itemCard}>
            <div className={styles.imageContainer}>
                <img draggable="false" className={styles.itemImage} alt={props.element.name} src={itemCoverArt}></img>
            </div>
            <div className={styles.name}> {props.element.name} </div>
            {artistName}
        </div>
    )
}

export default GridItem;
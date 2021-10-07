import React, { useState, useEffect } from 'react';
import styles from "./GridItem.module.css";

function GridItem(props){
    const elementImages = props.element.type === "track" ? props.element.album.images : props.element.images
    const itemCoverArt = elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"
    const artistName = props.element.type === "playlist" ? "" : props.element.type === "artist" ? "" 
        : <a href={props.element.artists[0].uri}><div className={styles.artistName}> {props.element.artists[0].name} </div> </a>;
    const ownerName = props.element.type === "playlist" ? <a href={props.element.owner.uri}><div className={styles.artistName}> {props.element.owner.display_name} </div></a> : "";

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
            <a href={props.element.uri}> <div className={styles.name}> {props.element.name} </div> </a>
            {props.element.type !== "playlist" ?  
            artistName: 
            ownerName}
        </div>
    )
}

export default GridItem;
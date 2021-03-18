import React, { useState, useEffect } from 'react';

function SearchItem(props){
    const elementImages = props.element.type === "track" ? props.element.album.images : props.element.images
    const itemCoverArt = elementImages.length ? elementImages[0].url : "https://via.placeholder.com/150"
    console.log(props.element.type, itemCoverArt)

    return (
        <div className="search-item">
            <img src={itemCoverArt}></img>
            <div> {props.element.name} </div>
        </div>
    )
}

export default SearchItem;
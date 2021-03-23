import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import styles from "./SideBar.module.css";

function SideBar(props) {

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.className = styles.linkDragOver
  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.className = styles.boxLink
  }

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div id={styles.mainPanel}>
      <div id={styles.user}>
        <img id={styles.userImage} src="/user.png" alt="user" />
        <span id={styles.userName}> {props.userName} </span>
      </div>
      <div id={styles.boxList}>
        <h4 id={styles.boxesTitle}> Your Boxes </h4>
        {props.boxes.map((box) => {
          return (
            <Link className={styles.boxLink} key={box.id} to={`/box/${box.id}`} 
              onDragEnter={(e) => handleDragEnter(e)} 
              onDragLeave={(e) => handleDragLeave(e)}
              onDrop={(e) => handleDrop(e)}>
                <span> {box.name} </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default SideBar;
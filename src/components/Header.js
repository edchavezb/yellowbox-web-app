import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styles from "./Header.module.css";

function Header(props) {

  const [input, setInput] = useState("");
  const history = useHistory();
  const dispatch = props.dispatch;

  useEffect(() => {
    if (input) history.push(`/search/${input}`)
  }, [input])

  const handleCreateBox = () => {
    const highestId = parseInt(props.boxes[props.boxes.length - 1].id)
    const newId = (highestId + 1).toString()
    const newBox = {id: newId, name: "New Box", artists: [], albums: [], tracks: []}
    dispatch({type: "ADD_BOX", payload: {newBox: newBox}})
  }

  return (
    <div id={styles.header}> 
        <div id={styles.logoSide}>
          <div id={styles.logoContainer}>
            <img id={styles.logo} src="/logoybx.png"></img> YBX
          </div>
        </div>
        <div id={styles.headerTools}>
          <div id={styles.searchBox}>
            <div id={styles.inputWrapper}>
              <input id={styles.searchInput} type="text" onChange={(e) => setInput(e.target.value.trim().replace(" ", "%20"))} 
                onFocus={() => {if(input) history.push(`/search/${input}`)}}/>
            </div>
            <img id={styles.searchIcon} src="/icons/search.svg"></img>
          </div>
          <div id={styles.newButton} onClick={() => handleCreateBox()}>
            <img id={styles.plusIcon} src="/icons/plus.svg"></img>
          </div>
        </div>
    </div>
  );
}

export default Header;
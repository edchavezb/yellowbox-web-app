import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styles from "./Header.module.css";

function Header(props) {

  const [input, setInput] = useState("");
  const history = useHistory();
  const toggleModal = props.toggleModal

  useEffect(() => {
    if (input) history.push(`/search/${input}`)
  }, [input])

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
          <div id={styles.newButton} onClick={() => toggleModal({visible: true, type:"New Box"})}>
            <img id={styles.plusIcon} src="/icons/plus.svg"></img>
          </div>
        </div>
    </div>
  );
}

export default Header;
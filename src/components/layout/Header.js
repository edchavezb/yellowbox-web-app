import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styles from "./Header.module.css";

function Header({toggleModal}) {

  const [input, setInput] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (input) history.push(`/search/${input}`)
  }, [input])

  return (
    <div id={styles.header}> 
        <div id={styles.logoSide}>
          <div id={styles.logoContainer}>
            <img id={styles.ideogram} src="/ideogram.png" alt="ideogram"></img>
            <span id={styles.logo}> yellowbox </span>
          </div>
        </div>
        <div id={styles.headerTools}>
          <div id={styles.searchBox}>
            <div id={styles.inputWrapper}>
              <input id={styles.searchInput} type="text" onChange={(e) => setInput(e.target.value.trim().replace(" ", "%20"))} 
                onFocus={() => {if(input) history.push(`/search/${input}`)}}/>
            </div>
            <img id={styles.searchIcon} src="/icons/search.svg" alt="search"></img>
          </div>
          <div id={styles.newButton} onClick={() => toggleModal({visible: true, type:"New Box"})}>
            <img id={styles.plusIcon} src="/icons/plus.svg"></img>
          </div>
        </div>
    </div>
  );
}

export default Header;
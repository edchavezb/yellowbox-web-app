import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import styles from "./Layout.module.css";

function Layout(props) {

  const [input, setInput] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (input) history.push(`/search/${input}`)
  }, [input])

  return (
    <div id={styles.layout}>
      <section id={styles.header}>
        <div id={styles.logoSide}>
          <div id={styles.logoContainer}>
            YBX
          </div>
        </div>
        <div id={styles.headerTools}>
          <div id={styles.searchBox}>
            <div id={styles.inputWrapper}>
              <input id={styles.searchInput} type="text" onChange={(e) => setInput(e.target.value.trim().replace(" ", "%20"))} />
            </div>
            <img id={styles.searchIcon} src="/icons/search.svg"></img>
          </div>
        </div>

      </section>
      <section id={styles.sideBar}></section>
      <section id={styles.mainView}>
        {props.children}
      </section>
    </div>
  );
}

export default Layout;
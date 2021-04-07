import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import SideBar from "./SideBar"
import Header from "./Header"
import styles from "./Layout.module.css";

function Layout(props) {

  return (
    <div id={styles.layout}>
      <section id={styles.headerWrapper}>
        <Header boxes={props.userBoxes} toggleModal={props.toggleModal} dispatch={props.dispatch}/>
      </section>
      <section id={styles.sideBar}>
        <SideBar userName="Pablo Alboran" boxes={props.userBoxes} dispatch={props.dispatch}/>
      </section>
      <section id={styles.mainView}>
        {props.children}
      </section>
    </div>
  );
}

export default Layout;
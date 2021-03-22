import React, { useState, useEffect } from 'react';
import styles from "./Layout.module.css";

function Layout(props) {
    return (
        <div id={styles.layout}>
            <section id={styles.header}></section>
            <section id={styles.sideBar}></section>
            <section id={styles.mainView}>
                {props.children}
            </section>
        </div>
    );
}

export default Layout;
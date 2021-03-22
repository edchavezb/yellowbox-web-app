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
                <input type="text" onChange={(e) => setInput(e.target.value.trim().replace(" ", "+"))}/>
                <span> Search something </span>
            </section>
            <section id={styles.sideBar}></section>
            <section id={styles.mainView}>
                {props.children}
            </section>
        </div>
    );
}

export default Layout;
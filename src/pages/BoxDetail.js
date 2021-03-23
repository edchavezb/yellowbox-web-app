import React, { useState, useEffect } from 'react';

import styles from "./BoxDetail.module.css";

function BoxDetail(props) {

  return (
    <div id={styles.mainPanel}>
     <h2> {props.boxName} </h2>
    </div>
  )
}

export default BoxDetail;
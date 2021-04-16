import React, { useState, useEffect } from 'react';
import axios from 'axios'

import styles from "./Home.module.css"

function Home() {

  return (
    <div className="main-div">
      <h1> Welcome Pablo! </h1>
      <p>Search something...</p>
    </div>
  );
}

export default Home;
import React, { useState } from 'react';
/* import axios from 'axios' */

function Home() {

  const [artist, setArtist] = useState('')

  const handleArtistSearch = (artist) => {
    console.log(artist)
  }

  return (
    <div className="main-div">
      <h1> This is the Home Page biatch </h1>
      <input type="text" onChange={(e) => setArtist(e.target.value)}/>
      <button onClick={() => handleArtistSearch(artist)}> Search artist </button>
    </div>
  );
}

export default Home;
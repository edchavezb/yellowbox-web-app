import React, { useState, useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Layout from "./components/Layout";
import Home from "./pages/Home"
import Search from "./pages/Search"
import BoxDetail from "./pages/BoxDetail"

function App() {

  const defaultBoxes = [
    {
      id: "1234",
      name: "Favoritos Espanol",
      artists: [],
      albums: [],
      tracks: []
    },
    {
      id: "2454",
      name: "Top 2020",
      artists: [],
      albums: [],
      tracks: []
    }
  ]

  const updateBoxReducer = (state, action) => {
    const targetBox = {...state.find(box => box.id === action.payload.target)}
    switch (action.type) {
      case 'album':
        const updatedAlbums = [...targetBox.albums, action.payload.item]
      return [...state.filter(box => box.id !== action.payload.target), {...targetBox, albums: updatedAlbums}]
      case 'artist':
        const updatedArtists = [...targetBox.artists, action.payload.item]
      return [...state.filter(box => box.id !== action.payload.target), {...targetBox, artists: updatedArtists}]
      case 'track':
        const updatedTracks = [...targetBox.tracks, action.payload.item]
      return [...state.filter(box => box.id !== action.payload.target), {...targetBox, tracks: updatedTracks}]
    }
  }

  const [boxes, dispatch] = useReducer(updateBoxReducer, defaultBoxes)

  useEffect(() => {
    console.log(boxes)
  }, [boxes])

  return (
    <Router>
      <Layout userBoxes={boxes} dispatch={dispatch}>
        <Route exact path="/" component={Home} />
        <Route path="/search/:query" component={Search} />
        <Route path="/box/:id" render={(props) => <BoxDetail {...props} userBoxes={boxes}/>} />
      </Layout>
    </Router>
  );
}

export default App;
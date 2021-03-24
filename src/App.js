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

  const updateBoxes = (state, action) => {
    switch (action.type) {
      case 'UPDATE_BOX':
      return state.map((item, index) => index === action.payload.target ? action.payload.updatedBox : item)
      case 'ADD_BOX':
      return state.map((item, index) => index === action.payload.target ? action.payload.updatedBox : item)
      case 'DELETE_BOX':
      return state.map((item, index) => index === action.payload.target ? action.payload.updatedBox : item)
    }
  }

  const [boxes, dispatchBoxUpdates] = useReducer(updateBoxes, defaultBoxes)

  useEffect(() => {
    console.log(boxes)
  }, [boxes])

  return (
    <Router>
      <Layout userBoxes={boxes} dispatch={dispatchBoxUpdates}>
        <Route exact path="/" component={Home} />
        <Route path="/search/:query" component={Search} />
        <Route path="/box/:id" render={(props) => <BoxDetail {...props} userBoxes={boxes}/>} />
      </Layout>
    </Router>
  );
}

export default App;
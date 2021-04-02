import React, { useState, useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Layout from "./components/Layout";
import Home from "./pages/Home"
import Search from "./pages/Search"
import BoxDetail from "./pages/BoxDetail"
import Modal from "./components/Modal"

function App() {

  const defaultBoxes = [
    {
      id: "1234",
      name: "Favoritos Español",
      available: "public",
      creator: "eKDNF346",
      description: "Mis favoritos en el español",
      artists: [],
      albums: [],
      tracks: [],
      primarySorting: {
        artists: "custom",
        albums: "custom", 
        tracks: "custom"
      },
      secondarySorting: {
        albums: "none", 
        tracks: "none"
      },
      view: {
        artists: "grid",
        albums: "grid",
        tracks: "grid"
      },
      ascendingOrder: {
        artists: false,
        albums: true,
        tracks: false
      },
      sectionVisibility: {
        artists: true,
        albums: true, 
        tracks: true
      }
    },
    {
      id: "2454",
      name: "Top 2020",
      available: "public",
      creator: "eKDNF346",
      description: "Top albums from 2020",
      artists: [],
      albums: [],
      tracks: [],
      primarySorting: {
        artists: "custom",
        albums: "custom", 
        tracks: "custom"
      },
      secondarySorting: {
        albums: "none", 
        tracks: "none"
      },
      view: {
        artists: "list",
        albums: "grid",
        tracks: "grid"
      },
      ascendingOrder: {
        artists: false,
        albums: true,
        tracks: true
      },
      sectionVisibility: {
        artists: true,
        albums: true, 
        tracks: true
      }
    }
  ]

  const updateBoxes = (state, action) => {
    switch (action.type) {
      case 'UPDATE_BOX':
      return state.map((item, index) => index === action.payload.target ? action.payload.updatedBox : item)
      case 'ADD_BOX':
      return [...state, action.payload.newBox]
      case 'DELETE_BOX':
      return state.filter((item) => item.id !== action.payload.target)
    }
  }

  const [boxes, dispatchBoxUpdates] = useReducer(updateBoxes, defaultBoxes)

  const [modal, setModal] = useState({visible: false, type: "", boxId: ""})

  useEffect(() => {
    console.log(boxes)
  }, [boxes])

  return (
    <Router>
      <Modal toggleModal={setModal} visible={modal.visible} type={modal.type} boxId={modal.boxId} userBoxes={boxes} dispatch={dispatchBoxUpdates} />
      <Layout userBoxes={boxes} toggleModal={setModal} dispatch={dispatchBoxUpdates}>
        <Route exact path="/" component={Home} />
        <Route path="/search/:query" component={Search} />
        <Route path="/box/:id" render={(props) => <BoxDetail {...props} userBoxes={boxes} toggleModal={setModal}/>} />
      </Layout>
    </Router>
  );
}

export default App;
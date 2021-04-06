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
      sectionSorting: {
        artists: {
          primarySorting: "custom",
          view: "list",
          ascendingOrder: false,
          subSections: false
        },
        albums: {
          primarySorting: "custom",
          secondarySorting: "none",
          view: "grid",
          ascendingOrder: false,
          subSections: false
        },
        tracks: {
          primarySorting: "custom",
          secondarySorting: "none",
          view: "grid",
          ascendingOrder: false,
          subSections: false
        }
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
      sectionSorting: {
        artists: {
          primarySorting: "custom",
          view: "list",
          ascendingOrder: false,
          subSections: true
        },
        albums: {
          primarySorting: "custom",
          secondarySorting: "none",
          view: "grid",
          ascendingOrder: false,
          subSections: false
        },
        tracks: {
          primarySorting: "custom",
          secondarySorting: "none",
          view: "grid",
          ascendingOrder: false,
          subSections: false
        }
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
    console.log(JSON.stringify(boxes[0].artists))
  }, [boxes])

  useEffect(() => {
    if (modal.visible) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
    }
  }, [modal])

  return (
    <Router>
      <Modal toggleModal={setModal} visible={modal.visible} type={modal.type} boxId={modal.boxId} userBoxes={boxes} dispatch={dispatchBoxUpdates} itemData={modal.itemData} />
      <Layout userBoxes={boxes} toggleModal={setModal} dispatch={dispatchBoxUpdates}>
        <Route exact path="/" component={Home} />
        <Route path="/search/:query" component={Search} />
        <Route path="/box/:id" render={(props) => <BoxDetail {...props} userBoxes={boxes} toggleModal={setModal}/>} />
      </Layout>
    </Router>
  );
}

export default App;
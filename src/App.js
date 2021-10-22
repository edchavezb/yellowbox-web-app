import React, { useState, useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Layout from "./components/layout/Layout";
import Home from "./pages/Home"
import Search from "./pages/Search"
import BoxDetail from "./pages/BoxDetail"
import Modal from "./components/Modal"

import defaultBoxes from "./DefaultBoxes"
import ItemDetail from './pages/ItemDetail';

function App() {

  const updateBoxes = (state, action) => {
    switch (action.type) {
      case 'UPDATE_BOX':
      return state.map((item, index) => index === action.payload.target ? action.payload.updatedBox : item)
      case 'ADD_BOX':
      return [...state, action.payload.newBox]
      case 'DELETE_BOX':
      return state.filter((item) => item.id !== action.payload.target)
      default :
    }
  }

  const [boxes, dispatchBoxUpdates] = useReducer(updateBoxes, defaultBoxes)

  const [modal, setModal] = useState({visible: false, type: "", boxId: "", page: ""})

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
      <Modal toggleModal={setModal} visible={modal.visible} type={modal.type} boxId={modal.boxId} userBoxes={boxes} page={modal.page} dispatch={dispatchBoxUpdates} itemData={modal.itemData} />
      <Layout userBoxes={boxes} toggleModal={setModal} dispatch={dispatchBoxUpdates}>
        <Route exact path="/" component={Home} />
        <Route path="/search/:query" render={(props) => <Search {...props} toggleModal={setModal}/>} />
        <Route path="/box/:id" render={(props) => <BoxDetail {...props} userBoxes={boxes} toggleModal={setModal}/>} />
        <Route path="/detail/:type/:query" render={(props) => <ItemDetail {...props} toggleModal={setModal}/>} />
      </Layout>
    </Router>
  );
}

export default App;
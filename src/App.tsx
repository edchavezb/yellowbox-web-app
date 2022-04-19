import React, { useState, useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Layout from "./components/layout/Layout";
import Home from "./pages/Home"
import Search from "./pages/Search"
import BoxDetail from "./pages/BoxDetail"
import Modal from "./components/layout/Modal"

import defaultBoxes from "./DefaultBoxes"
import ItemDetail from './pages/ItemDetail';
import { ModalState, UserBox } from './interfaces';

enum UpdateBoxTypes {
  UPDATE_BOX = 'UPDATE_BOX',
  ADD_BOX = 'ADD_BOX',
  DELETE_BOX = 'DELETE_BOX',
}

interface UpdateBoxPayload {
  updatedBox: UserBox
  newBox: UserBox
  targetIndex: number
  targetId: string
}

function App() {

  const updateBoxes = (state: UserBox[], action: {type: UpdateBoxTypes, payload: UpdateBoxPayload }) => {
    switch (action.type) {
      case 'UPDATE_BOX':
      return state.map((item, index) => index === action.payload.targetIndex ? action.payload.updatedBox : item)
      case 'ADD_BOX':
      return [...state, action.payload.newBox]
      case 'DELETE_BOX':
      return state.filter((item) => item.id !== action.payload.targetId)
      default :
      return state
    }
  }

  const [boxes, dispatchBoxUpdates] = useReducer(updateBoxes, defaultBoxes)

  const [modal, setModal] = useState<ModalState>({itemData: undefined, visible: false, type: "", boxId: "", page: ""})

  useEffect(() => {
    console.log(boxes)
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
        <Route path="/detail/:type/:id" render={(props) => <ItemDetail key={props.match.params.id} {...props} toggleModal={setModal}/>} />
      </Layout>
    </Router>
  );
}

export default App;
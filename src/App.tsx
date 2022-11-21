import React, { useState, useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Layout from "./components/layout/Layout";
import Home from "./pages/Home"
import AuthSuccess from './pages/AuthSuccess';
import Search from "./pages/Search"
import BoxDetail from "./pages/BoxDetail"
import Modal from "./components/layout/Modal"

import defaultBoxes from "./core/mocks/DefaultBoxes"
import ItemDetail from './pages/ItemDetail';
import { ModalState, User, UserBox } from './core/types/interfaces';
import SpotifyUser from './pages/SpotifyUser';

const defaultUserData: User = {
  auth: {
    code: null,
    refreshToken: null
  },
  userData: {
    displayName: '',
    userId: '',
    uri: '',
    image: '',
    email: ''
  }
}

enum UserReducerActionTypes {
  UPDATE_USER = 'UPDATE_USER'
}

enum UserBoxesActionTypes {
  UPDATE_BOX = 'UPDATE_BOX',
  NEW_BOX = 'NEW_BOX',
  DELETE_BOX = 'DELETE_BOX',
}

interface UpdateBoxPayload {
  updatedBox: UserBox
  targetIndex?: number
  targetId?: string
}

function App() {

  const userBoxesReducer = (state: UserBox[], action: {type: UserBoxesActionTypes, payload: UpdateBoxPayload }) => {
    switch (action.type) {
      case 'UPDATE_BOX':
      return state.map((item, index) => index === action.payload.targetIndex ? action.payload.updatedBox : item)
      case 'NEW_BOX':
      return [...state, action.payload.updatedBox]
      case 'DELETE_BOX':
      return state.filter((item) => item.id !== action.payload.targetId)
      default :
      return state
    }
  }

  const userReducer = (state: User, action: {type: UserReducerActionTypes, payload: User }) => {
    switch (action.type) {
      case 'UPDATE_USER':
      return action.payload
      default :
      return state
    }
  }

  const [boxes, dispatchBoxAction] = useReducer(userBoxesReducer, defaultBoxes)
  const [user, dispatchUserAction] = useReducer(userReducer, defaultUserData)

  const [modal, setModal] = useState<ModalState>({itemData: undefined, visible: false, type: "", boxId: "", page: ""})

  useEffect(() => {
    console.log(boxes)
  }, [boxes])

  useEffect(() => {
    console.log(user)
  }, [user])

  useEffect(() => {
    if (modal.visible) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
    }
  }, [modal])

  return (
    <Router>
      <Modal toggleModal={setModal} visible={modal.visible} type={modal.type} boxId={modal.boxId} userBoxes={boxes} page={modal.page} dispatch={dispatchBoxAction} itemData={modal.itemData} />
      <Layout userBoxes={boxes} user={user} toggleModal={setModal} dispatch={dispatchBoxAction}>
        <Route exact path="/" render={(props) => <Home {...props} user={user}/>} />
        <Route path="/authsuccess" render={(props) => <AuthSuccess {...props} dispatchUser={dispatchUserAction}/>} />
        <Route path="/search/:query" render={(props) => <Search {...props} toggleModal={setModal}/>} />
        <Route path="/box/:id" render={(props) => <BoxDetail {...props} userBoxes={boxes} toggleModal={setModal}/>} />
        <Route path="/detail/:type/:id" render={(props) => <ItemDetail key={props.match.params.id} {...props} toggleModal={setModal}/>} />
        <Route path="/myaccounts/spotify" render={(props) => <SpotifyUser {...props} user={user} dispatchUser={dispatchUserAction} toggleModal={setModal}/>} />
      </Layout>
    </Router>
  );
}

export default App;
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
import { ModalState, SpotifyLoginData, YellowboxUser, UserBox } from './core/types/interfaces';
import SpotifyUser from './pages/SpotifyUser';

const initialSpotifyLoginData: SpotifyLoginData = {
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

const initialUserData: YellowboxUser = {
  _id: '',
  displayName: '',
  image: '',
  email: '',
  services: {
    spotify: '',
    lastfm: ''
  }
}

enum UserReducerActionTypes {
  UPDATE_USER = 'UPDATE_USER'
}

enum SpotifyLoginActionTypes {
  UPDATE_LOGIN = 'UPDATE_LOGIN'
}

function App() {

  const userReducer = (state: YellowboxUser, action: {type: UserReducerActionTypes, payload: YellowboxUser }) => {
    switch (action.type) {
      case 'UPDATE_USER':
      return action.payload
      default :
      return state
    }
  }

  const spotifyUserReducer = (state: SpotifyLoginData, action: {type: SpotifyLoginActionTypes, payload: SpotifyLoginData }) => {
    switch (action.type) {
      case 'UPDATE_LOGIN':
      return action.payload
      default :
      return state
    }
  }

  const [ybxUser, dispatchYbxUserAction] = useReducer(userReducer, initialUserData)
  const [spotifyLogin, dispatchSpotifyLoginAction] = useReducer(spotifyUserReducer, initialSpotifyLoginData)

  const [modal, setModal] = useState<ModalState>({itemData: undefined, visible: false, type: "", boxId: "", page: ""})

  useEffect(() => {
    console.log(spotifyLogin)
  }, [spotifyLogin])

  useEffect(() => {
    console.log(ybxUser)
  }, [ybxUser])

  useEffect(() => {
    if (modal.visible) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
    }
  }, [modal])

  return (
    <Router>
      <Modal toggleModal={setModal} visible={modal.visible} type={modal.type} boxId={modal.boxId} user={ybxUser} page={modal.page} itemData={modal.itemData} />
      <Layout user={ybxUser} login={spotifyLogin} toggleModal={setModal}>
        <Route exact path="/" render={(props) => <Home {...props} user={spotifyLogin}/>} />
        <Route path="/authsuccess" render={(props) => <AuthSuccess {...props} dispatchSpotifyLogin={dispatchSpotifyLoginAction} dispatchUser={dispatchYbxUserAction} />} />
        <Route path="/search/:query" render={(props) => <Search {...props} toggleModal={setModal}/>} />
        <Route path="/box/:id" render={(props) => <BoxDetail {...props} toggleModal={setModal}/>} />
        <Route path="/detail/:type/:id" render={(props) => <ItemDetail key={props.match.params.id} {...props} toggleModal={setModal}/>} />
        <Route path="/myaccounts/spotify" render={(props) => <SpotifyUser {...props} user={spotifyLogin} dispatchUser={dispatchSpotifyLoginAction} toggleModal={setModal}/>} />
      </Layout>
    </Router>
  );
}

export default App;
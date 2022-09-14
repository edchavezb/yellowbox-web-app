//import React, { useState, useEffect } from 'react';
//import axios from 'axios'

//import styles from "./Home.module.css"
import { RouteComponentProps, withRouter } from "react-router-dom";
import querystring from 'querystring'
import credentials from '../keys'
import { User } from "../interfaces";

interface IProps {
  user: User
}

function Home({location, user}: RouteComponentProps & IProps) {

  const generateRandomString = (length: number) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const handleLogin = () => {
    const scopes = [
      'user-top-read',
      'user-read-recently-played',
      'user-read-currently-playing',
      'user-library-read',
      'user-read-private',
      'user-read-email',
      'playlist-modify-public'
    ]

    window.location.replace('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: credentials.id,
      scope: scopes.join("%20"),
      redirect_uri: 'http://localhost:3000/authsuccess',
      state: generateRandomString(16)
    }));
  }

  if (!user.auth.code){
    return (
      <div className="main-div">
        <h1> Please log in with your Spotify account </h1>
        <button onClick={handleLogin}> Log in </button>
      </div>
    );
  } else {
    return (
      <div className="main-div">
        <h1> Welcome {user.userData.displayName.split(" ")[0]} </h1>
        <h4> Use the search box to find your favorite music </h4>
      </div>
    );
  }
}

export default withRouter(Home);
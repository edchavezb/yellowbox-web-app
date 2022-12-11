//import React, { useState, useEffect } from 'react';
//import axios from 'axios'

import styles from "./Home.module.css"
import { RouteComponentProps, withRouter } from "react-router-dom";
import querystring from 'querystring'
import credentials from '../keys'
import { SpotifyLoginData } from "../core/types/interfaces";
import { useEffect } from "react";
import { getUserBoxesApi } from "../core/api/userboxes";

interface IProps {
  user: SpotifyLoginData
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
      scope: scopes.join(" "),
      redirect_uri: `${process.env.REACT_APP_PROJECT_ROOT}/authsuccess`,
      state: generateRandomString(16)
    }));
  }

  if (!user.auth.code){
    return (
      <div className="main-div">
        <h1> Please log in with one of your accounts </h1>
        <button className={styles.roundedButton} onClick={handleLogin}>
          <div className={styles.buttonContents}>
            <img className={styles.spotifyIcon} src='/icons/spotify_icon_white.png' alt='spotify'/> 
            <span>Log in with Spotify</span>
          </div>
        </button>
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
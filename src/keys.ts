console.log("API keys are loaded");

const spotify_credentials = {
  id: process.env.REACT_APP_SPOTIFY_ID,
  secret: process.env.REACT_APP_SPOTIFY_SECRET
}

export default spotify_credentials;
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home"
import Search from "./pages/Search/Search"
import BoxDetail from "./pages/BoxDetail/BoxDetail"
import Modal from "./components/layout/Modal/Modal"
import ItemDetail from './pages/ItemDetail/ItemDetail';
import SpotifyUser from './pages/SpotifyUser/SpotifyUser';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { getAuthenticatedUserData } from 'core/api/users';
import { setAuthenticatedUser, setIsUserLoggedIn } from 'core/features/user/userSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import FolderDetail from 'pages/FolderDetail/FolderDetail';
import { firebaseAuth } from 'core/services/firebase';
import { getSpotifyLoginData } from 'core/helpers/getSpotifyLoginData';
import { setSpotifyLoginData } from 'core/features/spotifyService/spotifyLoginSlice';
import SpotifyAuthSuccess from './pages/SpotifyAuthSuccess';
import { SpotifyLoginData, YellowboxUser } from 'core/types/interfaces';

function App() {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(state => state.modalData.modalState)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const appUser = await getAuthenticatedUserData();
        if (appUser) {
          dispatch(setAuthenticatedUser(appUser!))
          dispatch(setIsUserLoggedIn(true))

          if (appUser.services?.spotify) {
            const { refreshToken, id: spotifyId } = appUser.services.spotify;
            const spotifyLogin = await getSpotifyLoginData(refreshToken, spotifyId);
            if (spotifyLogin) {
              dispatch(setSpotifyLoginData(spotifyLogin))
            }
          }
        }
      }
      else {
        dispatch(setIsUserLoggedIn(false));
        dispatch(setAuthenticatedUser({} as YellowboxUser));
        dispatch(setSpotifyLoginData({} as SpotifyLoginData));
      }
      setIsLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (modalData.visible) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
    }
  }, [modalData])

  if (isLoading) {
    return (
      <div className="loading">
        <div id="logoContainer">
          <img id="ideogram" src="/ideogram.png" alt="ideogram"></img>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Modal />
      <Layout>
        <Route exact path="/" render={(props) => <Home {...props} />} />
        <Route path="/authsuccess" render={() => <SpotifyAuthSuccess />} />
        <Route path="/search/:query?" render={() => <Search />} />
        <Route path="/box/:id" render={() => <BoxDetail />} />
        <Route path="/folder/:id" render={() => <FolderDetail />} />
        <Route path="/detail/:type/:id" render={(props) => <ItemDetail key={props.match.params.id} {...props} />} />
        <Route path="/myaccounts/spotify" render={() => <SpotifyUser />} />
      </Layout>
    </Router>
  );
}

export default App;
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home"
import Search from "./pages/Search/Search"
import BoxDetail from "./pages/BoxDetail/BoxDetail"
import Modal from "./components/layout/Modal/Modal"
import ItemDetail from './pages/ItemDetail/ItemDetail';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import FolderDetail from 'pages/FolderDetail/FolderDetail';
import { firebaseAuth } from 'core/services/firebase';
import SpotifyAuthSuccess from './pages/Spotify/AuthSuccess/SpotifyAuthSuccess';
import { loginService } from 'core/services/loginService';
import SpotifyDashboard from 'pages/Spotify/SpotifyDashboard';
import Account from 'pages/Account/Account';
import { useToast } from '@chakra-ui/react';
import { setIsToastOpen } from 'core/features/toast/toastSlice';
import QueuePage from 'pages/Queue/QueuePage';
import UserPage from 'pages/UserPage/UserPage';
import FollowedBoxesPage from 'pages/Favorites/FavoritesPage';

function App() {
  const dispatch = useAppDispatch();
  const toast = useToast()
  const modalState = useAppSelector(state => state.modalData.modalState);
  const toastState = useAppSelector(state => state.toastData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (authUser) => {
      console.log("Auth changed")
      loginService(firebaseAuth, authUser, dispatch, setIsLoading);
    });
  }, [dispatch]);

  useEffect(() => {
    if (modalState.visible) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
    }
  }, [modalState])

  useEffect(() => {
    const {isOpen, options} = toastState;
    if (isOpen) {
      toast({
        ...options,
        onCloseComplete: () => dispatch(setIsToastOpen(false))
      });
    }
  }, [toastState, toast, dispatch])

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
        <Route path="/account" render={() => <Account />} />
        <Route path="/user/:username" render={() => <UserPage />} />
        <Route path="/search/:query?" render={() => <Search />} />
        <Route path="/box/:id" render={() => <BoxDetail />} />
        <Route path="/folder/:id" render={() => <FolderDetail />} />
        <Route path="/detail/:type/:id" render={(props) => <ItemDetail key={props.match.params.id} {...props} />} />
        <Route path="/linked-services/spotify" render={() => <SpotifyDashboard />} />
        <Route path="/favorites" render={() => <FollowedBoxesPage />} />
        <Route path="/queue" render={() => <QueuePage />} />
        <Route path="/authsuccess" render={() => <SpotifyAuthSuccess />} />
      </Layout>
    </Router>
  );
}

export default App;
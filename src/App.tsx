import { useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Layout from "./components/layout/Layout";
import Home from "./pages/Home/Home"
import AuthSuccess from './pages/AuthSuccess';
import Search from "./pages/Search/Search"
import BoxDetail from "./pages/BoxDetail/BoxDetail"
import Modal from "./components/layout/Modal/Modal"
import ItemDetail from './pages/ItemDetail/ItemDetail';
import SpotifyUser from './pages/SpotifyUser/SpotifyUser';
import { useAppSelector } from 'core/hooks/useAppSelector';
import { refreshSpotifyToken } from 'core/api/spotify';
import { getUserDataBySpotifyId } from 'core/api/users';
import { setSpotifyLoginData } from 'core/features/spotifyService/spotifyLoginSlice';
import { setAuthenticatedUser, setIsUserLoggedIn } from 'core/features/user/userSlice';
import { useAppDispatch } from 'core/hooks/useAppDispatch';
import FolderDetail from 'pages/FolderDetail/FolderDetail';

const refreshToken = localStorage.getItem("ybx-spotify-refresh-token");
const spotifyId = localStorage.getItem("ybx-spotify-user-id");

function App() {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(state => state.modalData.modalState)

  useEffect(() => {
    const getUserData = async (refreshToken: string, spotifyId: string) => {
      const refreshResponse = await refreshSpotifyToken(refreshToken);
      if (refreshResponse) {
        const { access_token: token } = refreshResponse;
        const spotifyLogin = {
          auth: {
            refreshToken,
            accessToken: token
          },
          userData: {
            userId: spotifyId
          }
        }
        dispatch(setSpotifyLoginData(spotifyLogin))
        const user = await getUserDataBySpotifyId(spotifyId)
        if (user) {
          dispatch(setAuthenticatedUser(user!))
          dispatch(setIsUserLoggedIn(true))
        }
        else {
          dispatch(setIsUserLoggedIn(false))
        }
      }
    }

    if (refreshToken && spotifyId) {
      getUserData(refreshToken, spotifyId);
    }
    else {
      dispatch(setIsUserLoggedIn(false))
    }
  }, [dispatch]);

  useEffect(() => {
    if (modalData.visible) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
    }
  }, [modalData])

  return (
    <Router>
      <Modal />
      <Layout>
        <Route exact path="/" render={(props) => <Home {...props} />} />
        <Route path="/authsuccess" render={() => <AuthSuccess />} />
        <Route path="/search/:query" render={() => <Search />} />
        <Route path="/box/:id" render={() => <BoxDetail />} />
        <Route path="/folder/:id" render={() => <FolderDetail />} />
        <Route path="/detail/:type/:id" render={(props) => <ItemDetail key={props.match.params.id} {...props} />} />
        <Route path="/myaccounts/spotify" render={() => <SpotifyUser />} />
      </Layout>
    </Router>
  );
}

export default App;
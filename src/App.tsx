import { useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Layout from "./components/layout/Layout";
import Home from "./pages/Home"
import AuthSuccess from './pages/AuthSuccess';
import Search from "./pages/Search"
import BoxDetail from "./pages/BoxDetail"
import Modal from "./components/layout/Modal"
import ItemDetail from './pages/ItemDetail';
import SpotifyUser from './pages/SpotifyUser';
import { useAppSelector } from 'core/hooks/useAppSelector';

function App() {
  const modalData = useAppSelector(state => state.modalData.modalState)

  useEffect(() => {
    if (modalData.visible) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
    }
  }, [modalData])

  return (
    <Router>
      <Modal/>
      <Layout>
        <Route exact path="/" render={(props) => <Home {...props}/>} />
        <Route path="/authsuccess" render={() => <AuthSuccess/>} />
        <Route path="/search/:query" render={() => <Search/>} />
        <Route path="/box/:id" render={() => <BoxDetail/>} />
        <Route path="/detail/:type/:id" render={(props) => <ItemDetail key={props.match.params.id} {...props}/>} />
        <Route path="/myaccounts/spotify" render={() => <SpotifyUser/>} />
      </Layout>
    </Router>
  );
}

export default App;
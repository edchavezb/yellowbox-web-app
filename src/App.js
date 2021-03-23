import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Layout from "./components/Layout";
import Home from "./pages/Home"
import Search from "./pages/Search"
import BoxDetail from "./pages/BoxDetail"

function App() {

  const defaultBoxes = [
    {
      id: "1234",
      name: "Favoritos Espanol"
    },
    {
      id: "2454",
      name: "Top 2020"
    }
  ]
  const [boxes, setBoxes] = useState(defaultBoxes)

  return (
    <Router>
      <Layout userBoxes={boxes}>
        <Route exact path="/" component={Home} />
        <Route path="/search/:query" component={Search} />
        <Route path="/box/:id" component={BoxDetail} />
      </Layout>
    </Router>
  );
}

export default App;
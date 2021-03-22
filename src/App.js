import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import Layout from "./components/Layout";
import Home from "./pages/Home"
import Search from "./pages/SearchResults"

function App() {

  const [route, setRoute] = useState("/")

  return (
    <Router>
      <Layout>
        <Route exact path="/" component={Home} />
        <Route path="/search/:query" component={Search} />
      </Layout>
    </Router>
  );
}

export default App;
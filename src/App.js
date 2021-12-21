import {React,useState} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

//components
import Nav from "./components/Nav";
import SquareLoader from './components/SquareLoader';

//pages
import Home from './pages/Home';
import StateDetail from './pages/StateDetail';
import NotFound from './pages/NotFound';

import API from "./utils/API";
//styles
import './App.css';

function App(props) {
  return (
    <>
      <Router>
      <Nav />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/:STATE_NAME" component={StateDetail}/>
          <Route component={NotFound}/>
        </Switch>
      </Router>
    </>
  );
}

export default App;
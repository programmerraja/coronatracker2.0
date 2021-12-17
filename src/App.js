

import {React,useState} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';


//components
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import SquareLoader from './components/SquareLoader';

//pages
import Home from './pages/Home';

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
          
          
          <Route component={NotFound}/>
        </Switch>
        <Footer/>
      </Router>
    </>
  );
}

export default App;
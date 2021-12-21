import {React,createRef} from "react";
import {Link } from "react-router-dom";

import "./style.css";


function Nav({user}) {

  return ( <div className="nav">
              <div className="nav-brand">
                    <Link to="/">  
                        <p><i className="fas fa-shield-virus"></i>Corona Tracker<i className="fas fa-shield-virus"></i></p>              
                    </Link>
              </div>
        </div>);

}

export default Nav;

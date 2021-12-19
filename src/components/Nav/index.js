import {React,createRef} from "react";

import {useHistory,Link } from "react-router-dom";

import "./style.css";

// import logo from "../../img/logo.png";
// import userImg from "../../img/user.svg";


function Nav({user}) {

  const nav_ref=createRef();
  const crosslines_ref=createRef();
  const line_ref=createRef();


  function toggle() {
    nav_ref.current.classList.toggle("nav_list_show");
    crosslines_ref.current.classList.toggle("crosslines_show");
    line_ref.current.classList.toggle("lines_hide");
  }

  let nav_link;

  // <img src={logo}/> <p>Corona Tracker</p>  
  return ( <div className="nav">
              <div className="nav-brand">
                    <Link to="/">  
                            <p><i class="fas fa-shield-virus"></i>Corona Tracker<i class="fas fa-shield-virus"></i></p>              
                    </Link>
              </div>

              <div className="lines" onClick={toggle} ref={line_ref}>  
                <div className="smallline">
                </div>
                <div className="smallline">
                </div>
                <div className="smallline">
                </div>
              </div>

              <div className="nav_list" ref={nav_ref}>
                <div className="crosslines" onClick={toggle} ref={crosslines_ref}>
                </div>
                
              </div>
        </div>);

}

export default Nav;

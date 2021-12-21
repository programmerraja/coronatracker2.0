import React from "react";

import NoResultCard from "../../components/NoResultCard";

import "./style.css";
function NotFound (){
  
  return (
    <div className="notfound_container">
        <h1>404</h1>
       <NoResultCard msg="Page not found"/>
    </div>
    );
}

export default NotFound;

import {React} from "react";

import "./style.css";

function NoResultCard({msg}){
  return ( 
        <div className="noresult_card">
            <p>{msg}</p>
        </div>
  )

    }

export default NoResultCard;

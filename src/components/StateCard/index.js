import {React,useState,useEffect} from "react";
import {useHistory} from "react-router-dom";

import "./style.css";

function StateCard({
                    state_short_name,
                    state_name,
                    districts,
                    confirmed,
                    recovered,
                    deceased,
                    population
                  }){

    
    const [d_confirmed,setConfirmed]=useState(confirmed);
    const [d_recovered,setRecovered]=useState(recovered);
    const [d_deceased,setDeceased]=useState(deceased);
    const [selected_district,setSelectedDistrict]=useState("none");

    const history=useHistory();
    
    useEffect(()=>{
        setConfirmed(confirmed);
        setRecovered(recovered);
        setDeceased(deceased);
    },[confirmed,recovered,deceased])
    

    const ChangeToDistrictData=(district_name)=>{
        for(const name in districts){
            if(name===district_name){
               setConfirmed(districts[name].total.confirmed?districts[name].total.confirmed:"Data Not Found")
               setRecovered(districts[name].total.recovered?districts[name].total.recovered:"Data Not Found")
               setDeceased(districts[name].total.deceased?districts[name].total.deceased:"Data Not Found")
            }
        }
        //if user select none we need show the state data
        if(district_name==="none"){
            setConfirmed(confirmed);
            setRecovered(recovered);
            setDeceased(deceased);
        }
    }
    const storeToLocalStorage=(state_short_name)=>{
        localStorage.setItem("districts",JSON.stringify(districts));
        localStorage.setItem("population",population);

        history.push(`/${state_short_name}`);
        
    }
  return ( 
    <>
        <div className="state_card">
            <div className="state_card-head">
                <p>{state_name}</p>
                <select className="state_card-select" 
                          onChange={(e)=>{
                              setSelectedDistrict(e.target.value);
                              ChangeToDistrictData(e.target.value);
                              }}>
                     <option value="none">None</option>
                    {
                        
                         districts && Object.keys(districts).map((district_name)=>{
                            return(<option value={district_name} selected={selected_district===district_name?true:false}>{district_name}</option>)
                        })
                    
                    }
                </select>
            </div>
        <div className="state_body-wrapper">
            <div className="state_card-total">
                <p>Total</p>
                <p><i class="fas fa-check-circle" style={{color:"brown"}}></i>Confirmed: {d_confirmed}</p>
                <p><i class="fas fa-heartbeat" style={{color:"green"}}></i>Recovered: {d_recovered}</p>
                <p><i class="fas fa-exclamation-circle" style={{color:"red"}}></i>Deceased: {d_deceased}</p>
            </div>
            <div className="state_card_link">
                <div> 
                <i class="fas fa-greater-than"  
                   onClick={()=>{
                    storeToLocalStorage(state_short_name)
                    }
                }></i>
                </div>
            </div>
        </div>
        </div>
    </>);

    }

export default StateCard;

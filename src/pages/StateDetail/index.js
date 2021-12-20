import {React,useEffect,useState} from "react";
import {useParams } from "react-router-dom";

import SquareLoader from "../../components/SquareLoader";
import Table from "../../components/Table";
import StateCard from "../../components/StateCard";
import NoResultCard from "../../components/NoResultCard";

import API from "../../utils/API";
import errorHandler from "../../utils/errorHandler";

import "./style.css";

function StateDetail() {

    const[state_data,setStateData]=useState({});
    const[districts,setDistricts]=useState({});
    const[population,setPopulation]=useState(1);
    const[selected_district,setSelectedDistrict]=useState("none");
    const[sort_by,setSortBy]=useState("");
    const[filter_date,setFilterDate]=useState("");
    const[is_find,setIsFind]=useState(true)
    const[msg,setMsg]=useState("");
    const[loading,setLoading]=useState(true);

    const { STATE_NAME } = useParams();

    useEffect(()=>{
      API.getStatesByDate()
      .then((res)=>{
          setLoading(false);
          let temp_state_data={}
          for(const state_name in res.data){
              if(state_name===STATE_NAME){
                temp_state_data[state_name]=res.data[state_name];
                setStateData(temp_state_data);
              }
          }  
      })
      .catch((res)=>{
        setLoading(false);
        console.log(res)
      });
      //parsing data form local storage
      let temp_district=JSON.parse(localStorage.getItem("districts"));
      let temp_population=JSON.parse(localStorage.getItem("poulation"));
      if(temp_district){
        setDistricts(temp_district);
      }
      if(temp_population){
        setPopulation(temp_population);
      }
  },[])

  const filterStateByDate=(search_date)=>{
    //checking if the date between 
    if(new Date(search_date)>new Date("2020-03-26") && new Date("2020-10-11")>new Date(search_date)){
      let temp_state_data={...state_data};
      for(const date in state_data[STATE_NAME]["dates"]){
          if(date===search_date){
            temp_state_data[STATE_NAME]["dates"][date].isHide=false;
          }
          else{
            temp_state_data[STATE_NAME]["dates"][date].isHide=true;
          }
        }
        setStateData(temp_state_data);
        setIsFind(true);
    }else{
      setIsFind(false);
      setMsg("Plse try the date between 2020-03-26 and 2020-10-11")
    }
  }

const sortByConfirmed=(states_meta,states_date,key)=>{ 
  for(let i=0;i<states_meta.length;i++){
    for(let j=0;j<states_meta.length;j++){
      if(states_meta[i].delta?.[key[0]]<states_meta[j].delta?.[key[0]]){
        let temp=states_meta[i];
        states_meta[i]=states_meta[j];
        states_meta[j]=temp;

        temp=states_date[i];
        states_date[i]=states_date[j];
        states_date[j]=temp;
      }
    }
  }
}

const sortByAffected=(states_meta,states_date,key)=>{
  for(let i=0;i<states_meta.length-1;i++){
    for(let j=0;j<states_meta.length-i-1;j++){
      //confirmed case divide by total population * 100 give affected %
      let state1_affected=(states_meta[i].delta?.confirmed/population)*100;
      let state2_affected=(states_meta[j].delta?.confirmed/population)*100
      if(state1_affected<state2_affected){
        let temp=states_meta[i];
        states_meta[i]=states_meta[j];
        states_meta[j]=temp;

        temp=states_date[i];
        states_date[i]=states_date[j];
        states_date[j]=temp;
      }
    }
  }

}
const sortByUserPreference=(sort_by)=>{
  if(sort_by){
      let states_meta=[];
      let states_date=[];

      Object.keys(state_data[STATE_NAME]["dates"]).forEach(date=>{
       
        //for some date there is no confirmed so we appending 0 for it for sorting purpose
        if(state_data[STATE_NAME]["dates"][date] && state_data[STATE_NAME]["dates"][date]["delta"]){
          if(!state_data[STATE_NAME]["dates"][date]["delta"])  {
            state_data[STATE_NAME]["dates"][date]["delta"]={"confirmed":0};
          }
        }
        states_date.push(date);
        states_meta.push(state_data[STATE_NAME]["dates"][date]);
      });

      let key=sort_by.split("-");

      if(key[0]==="confirmed"){
          sortByConfirmed(states_meta,states_date,key)
      }
      else if(key[0]==="affected"){
        sortByAffected(states_meta,states_date,key)
      }else{
        sortByVaccinated(states_meta,states_date,key)
      }
    let new_sorted_state_data={[STATE_NAME]:{"dates":{}}};
    //if asec travel from start else in reverse
    if(key[1]==="a"){
      for(let i=0;i<states_date.length;i++){
        new_sorted_state_data[STATE_NAME]["dates"][states_date[i]]={...states_meta[i]};
      }
    }else{
      for(let i=states_date.length-1;i>=0;i--){
        new_sorted_state_data[STATE_NAME]["dates"][states_date[i]]={...states_meta[i]};
      }
    }
    console.log(new_sorted_state_data)
    //assingin new states data
    setStateData({...new_sorted_state_data});
  }
}
  if(state_data && !loading ){
      return ( <>
                  <section className="search_container">
                        <input type="date" 
                              name="date" 
                              className="search_date" 
                              placeholder="Search by date" 
                              value={filter_date}
                              onChange={(e)=>{
                                    setFilterDate(e.target.value);
                                    filterStateByDate(e.target.value);
                                  }}
                        />

                      <div className="filter_option-wrapper">
                        <label className="filter_option-label">
                               <span>Sort By: </span></label>
                        <select
                            className="filter_option" 
                            onChange={(e)=>{
                              setSortBy(e.target.value);
                              sortByUserPreference(e.target.value);
                            }
                        }>
                            <option value="" selected={sort_by===""?true:false}>None</option>
                            <option value="confirmed-a" selected={sort_by==="confirmed-a"?true:false}>Confirmed(asec)</option>
                            <option value="confirmed-d" selected={sort_by==="confirmed-d"?true:false}>Confirmed(desc)</option>
                            <option value="affected-a" selected={sort_by==="affected-a"?true:false}>Affected%(asec)</option>
                            <option value="affected-d" selected={sort_by==="affected-d"?true:false}>Affected%(desc)</option>
                        </select>
                    </div>
                        <div className="state_card-head">
                        <label className="filter_option-label">
                               <span>District: </span></label>
                            <select className="state_card-select" 
                                      onChange={(e)=>{
                                          setSelectedDistrict(e.target.value);

                                          }}>
                                <option value="none" selected={selected_district==="none"?true:false}>None</option>
                                {
                                    districts && Object.keys(districts).map((district_name)=>{
                                        return(<option value={district_name} selected={selected_district===district_name?true:false}>{district_name}</option>)
                                    })
                                }
                            </select>
                        </div>
                  </section>


                  <section className="state_container">
                    {(is_find && selected_district==="none") ?
                      <Table state_data={state_data}/>:
                      ((msg && selected_district==="none") && <NoResultCard msg={msg}/>)
                    }
                    {
                      (selected_district!="none" && districts)&& <StateCard confirmed={districts[selected_district]?.total?.confirmed}
                                                              recovered={districts[selected_district]?.total?.recovered}
                                                              deceased={districts[selected_district]?.total?.deceased}/>
                    }
                  </section>  
          </>);
    }else{
      return(<>
              <SquareLoader  loading={loading}/>
             {msg &&  <NoResultCard msg={msg}/>}
             </>
             );
    }
}

export default StateDetail;

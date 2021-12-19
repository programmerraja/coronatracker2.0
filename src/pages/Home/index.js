import {React,useEffect,useState} from "react";
import "./style.css";

import SquareLoader from "../../components/SquareLoader";
import StateCard from "../../components/StateCard";
import NoResultCard from "../../components/NoResultCard";

import API from "../../utils/API";
import STATE_NAMES from "../../utils/state_Names";

import errorHandler from "../../utils/errorHandler";


function Home() {

    const[states,setStates]=useState({});
    const[search_state,setSearchState]=useState("");
    const[filter_date,setFilterDate]=useState("");
    const[sort_by,setSortBy]=useState("");
    const[msg,setMsg]=useState("");
  
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
      API.getStates()
      .then((res)=>{
          setLoading(false);
          setStates(res.data); 
      })
      .catch((res)=>{
        setLoading(false);
        
      });
  },[])

  const filterState=(search_state)=>{
    let new_states={...states}
    let isFind=false;
    Object.keys(states).map((state)=>{
      if(STATE_NAMES[state].toLowerCase().startsWith(search_state.toLowerCase())){
        isFind=true;
        new_states[state].isHide=false;
      }else{
        new_states[state].isHide=true;
      }
      setStates({...new_states});
      //if no state find set this msg
      if(!isFind){
        setMsg(`No Sate Found With Name ${search_state}`)
      }
    })

  }
  
  const getStatesByDate=(filter_date)=>{
    if(new Date(filter_date)>new Date("2020-03-26") && new Date("2020-10-11")>new Date(filter_date))
    {
      setLoading(true);
      API.getStatesByDate()
        .then((res)=>{
            setLoading(false);
            let new_state={}
            let empty_data={total:{confirmed:"Data Not Found",recovered:"Data Not Found",deceased:"Data Not Found"}}
            Object.keys(res.data).forEach((state)=>{
              //if we have data append it else say no data found
              new_state[state]=res.data[state]["dates"][filter_date]?res.data[state]["dates"][filter_date]:empty_data;
              //appending districts data to new state
              new_state[state]["districts"]={...states[state]?.["districts"]}

            })
            setStates(new_state); 
        })
        .catch((res)=>{
          setLoading(false);
          console.log(res)
        });
    }else{
      setStates({});
      setMsg("Plse try the date between 2020-03-26 and 2020-10-11");
    }
  }
  const sortByConfirmed=(states_meta,states_names,key)=>{
    for(let i=0;i<states_meta.length;i++){
      for(let j=0;j<states_meta.length;j++){
        if(states_meta[i].total?.[key[0]]<states_meta[j].total?.[key[0]]){
  
          let temp=states_meta[i];
          states_meta[i]=states_meta[j];
          states_meta[j]=temp;

          temp=states_names[i];
          states_names[i]=states_names[j];
          states_names[j]=temp;
        }
      }
    }
  }

  const sortByAffected=(states_meta,states_names,key)=>{
    for(let i=0;i<states_meta.length-1;i++){
      for(let j=0;j<states_meta.length-i-1;j++){
        //confirmed case divide by total population * 100 give affected %
        let state1_affected=(states_meta[i].total?.confirmed/states_meta[i].meta.population)*100;
        let state2_affected=(states_meta[j].total?.confirmed/states_meta[j].meta.population)*100
        if(state1_affected<state2_affected){
          let temp=states_meta[i];
          states_meta[i]=states_meta[j];
          states_meta[j]=temp;

          temp=states_names[i];
          states_names[i]=states_names[j];
          states_names[j]=temp;
        }
      }
    }

  }
  const sortByVaccinated=(states_meta,states_names,key)=>{
    for(let i=0;i<states_meta.length-1;i++){
      for(let j=0;j<states_meta.length-i-1;j++){
        //vaccinated does 1  divide by total population * 100 give vaccinated %
        let state1_vaccinated=(states_meta[i].total?.vaccinated1/states_meta[i]?.meta?.population)*100;
        let state2_vaccinated=(states_meta[j].total?.vaccinated1/states_meta[j]?.meta?.population)*100
        if(state1_vaccinated<state2_vaccinated){
          let temp=states_meta[i];
          states_meta[i]=states_meta[j];
          states_meta[j]=temp;

          temp=states_names[i];
          states_names[i]=states_names[j];
          states_names[j]=temp;
        }
      }
    }

  }
  const sortByUserPreference=(sort_by)=>{
    if(sort_by){
        let states_meta=[];
        let states_names=[];

        Object.keys(states).sort().forEach(state_name=>{
          debugger;
          //for some date there is no confirmed,etc so we appending 0 for it for sorting purpose
          if(states[state_name] && states[state_name]["total"]){
            if(!states[state_name]["total"]){
              states[state_name]["total"]={confirmed:0,vaccinated1:0,vaccinated2:0};
            }
            if(!states[state_name]["total"]["confirmed"]){
              states[state_name]["total"]["confirmed"]=0;
            }
            if(!states[state_name]["total"]["deceased"]){
              states[state_name]["total"]["deceased"]=0;
            }
            if(!states[state_name]["total"]["recovered"]){
              states[state_name]["total"]["recovered"]=0;
            }
          }
          states_names.push(state_name);
          states_meta.push(states[state_name])
          
        });
        let key=sort_by.split("-");
        if(key[0]==="confirmed"){
            sortByConfirmed(states_meta,states_names,key)
        }
        else if(key[0]==="affected"){
          sortByAffected(states_meta,states_names,key)
        }else{
          sortByVaccinated(states_meta,states_names,key)
        }
      let new_sorted_states={};
      //if asec travel from start else in reverse
      if(key[1]==="a"){
        for(let i=0;i<states_names.length;i++){
          new_sorted_states[states_names[i]]={...states_meta[i]};
        }
      }else{
        for(let i=states_names.length-1;i>=0;i--){
          new_sorted_states[states_names[i]]={...states_meta[i]};
        }
      }
      //assingin new states
      setStates({...new_sorted_states});
    }
  }
  const states_card=[]
  //iterating the states
  Object.keys(states).map((state)=>{
    //when user searching by state name
    if(!states[state].isHide){
     states_card.push(<StateCard 
              state_short_name={state}
              state_name={STATE_NAMES[state]} 
              districts={states[state]?.districts}
              confirmed={states[state]?.total?.confirmed}
              recovered={states[state]?.total?.recovered}
              deceased={states[state]?.total?.deceased}
              population={states[state]?.meta?.population}
          />)
    }
  })
    return ( <>
              <SquareLoader  loading={loading}/>
              <section className="search_container">
                    <input type="text" 
                           name="search_input" 
                           className="search_input" 
                           onChange={(e)=>{
                              setSearchState(e.target.value);
                              filterState(e.target.value)
                        
                            }}
                           value={search_state}
                           placeholder="SEARCH HERE..."
                    />  
                    <input type="date" 
                           name="date" 
                           className="search_date" 
                           placeholder="Search by date" 
                           value={filter_date}
                           onChange={(e)=>{
                                setFilterDate(e.target.value);
                                getStatesByDate(e.target.value);
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
                            <option value="affected-a" selected={sort_by==="affected-a"?true:false}>Affected(asec)</option>
                            <option value="affected-d" selected={sort_by==="affected-d"?true:false}>Affected(desc)</option>
                            <option value="vaccinated-a" selected={sort_by==="vaccinated-a"?true:false}>Vaccinated(asec)</option>
                            <option value="vaccinated-d" selected={sort_by==="vaccinated-d"?true:false}>Vaccinated(desc)</option>
                        </select>
                    </div>
              </section>


              <section className="state_container">
                        {(states_card.length>0 && !loading )? 
                            states_card:
                            msg && !loading && <NoResultCard msg={msg}/>
                        }
              </section>
      </>);
}

export default Home;

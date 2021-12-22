import { React, useEffect, useState } from "react";

import SquareLoader from "../../components/SquareLoader";
import StateCard from "../../components/StateCard";
import NoResultCard from "../../components/NoResultCard";

import API from "../../utils/API";
import STATE_NAMES from "../../utils/stateNames";

import "./style.css";

const START_DATE="2020-03-26";
const END_DATE="2021-10-31";

function Home() {
  const [states, setStates] = useState({});
  //for caching the time line series data
  const [states_time_cache, setStatesCache] = useState(null);
  //for filters
  const [filter_state, setFilterState] = useState("");
  const [filter_date, setFilterDate] = useState(END_DATE);
  const [sort_by, setSortBy] = useState("none");
  //for UX
  const [msg, setMsg] = useState("");
  const [is_find, setIsFind] = useState(true);
  const [is_valid_date, setValidDate] = useState(true);
  const [has_error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //checking if cache data avaliablle in local storage
    let states_cache = localStorage.getItem("states_cache");
    if (!states_cache) {
      API.getStates()
        .then((data) => {
          setLoading(false);
          setStates(data);
          //storing cache in local
          localStorage.setItem("states_cache", JSON.stringify(data));
        })
        .catch((data) => {
          setLoading(false);
          setError(true);
          setMsg("Error while loading data try refreshing the page");
        });
    } else {
      //if cache avalible use it
      setLoading(false);
      setStates(JSON.parse(states_cache));
    }
  }, []);

  const filterState = (filter_state) => {
    let new_states = { ...states };
    let isFind = false;
    Object.keys(states).map((state) => {
      if (
        STATE_NAMES[state].toLowerCase().startsWith(filter_state.toLowerCase())
      ) {
        isFind = true;
        new_states[state].isHide = false;
      } else {
        new_states[state].isHide = true;
      }
      setStates({ ...new_states });
      //if no state find set this msg
      if (!isFind) {
        setIsFind(false);
        setMsg(`No Sate Found With Name ${filter_state}`);
      } else {
        setIsFind(true);
      }
    });
  };
  
  const appendData=(data)=>{
    let new_state = {};
    //for some state no data so we adding empty data with info
    let empty_data = {
      total: {
        confirmed: "Data Not Found",
        recovered: "Data Not Found",
        deceased: "Data Not Found",
      },
    };
  
    Object.keys(data).forEach((state) => {
      //if we have data append it else append empty  data.
      new_state[state] = data[state]["dates"][filter_date]
        ? data[state]["dates"][filter_date]
        : empty_data;
      //appending districts data to new state because time series API endpoints 
      //does not return districts
      new_state[state]["districts"] = {
        ...states[state]?.["districts"],
      };
      //appending meta data for population
      new_state[state]["meta"]={
        ...states[state]?.["meta"],
      }
    });
    return new_state;
  }

  const getStatesByDate = (filter_date) => {
    //checking if the date between 2020-03-26 and 2021-10-31 to avoid iterating
    //date list unwantendly
    if (
      new Date(filter_date) >= new Date(START_DATE) &&
      new Date(END_DATE) >= new Date(filter_date)
    ) {
      //checking if cache data avaliablle in local storage
      if (!states_time_cache) {
        setLoading(true);
        API.getStatesByDate()
          .then((data) => {
            setLoading(false);
            //append the wanted data
            let new_state=appendData(data);
            setStates(new_state);
            //cannot store the huge data in local storage so we storing on state;
            setStatesCache(data);
            setValidDate(true);
            //clearing the user search
            if(filter_state){
              setFilterState("");
            }
            if(sort_by){
              setSortBy("none");
            }
          })
          .catch((data) => {
            setLoading(false);
            setError(true);
            setMsg("Error while loading data try refreshing the page");
          });
      } else {
        //if cache avalible use it
        //append the wanted data
        let new_state=appendData(states_time_cache);
        setStates(new_state);
        setValidDate(true);
        //clearing the user search
        if(filter_state){
          setFilterState("");
        }
        if(sort_by){
          setSortBy("none");
        }
      }
    } else {
      setValidDate(false);
      setMsg(`Plse try the date between ${START_DATE} and ${END_DATE}`);
    }
  };

  const swap=(states_meta,states_names,i,j)=>{
       //swapping the meta and state name such that it will in sync
       let temp = states_meta[i];
       states_meta[i] = states_meta[j];
       states_meta[j] = temp;

       temp = states_names[i];
       states_names[i] = states_names[j];
       states_names[j] = temp;
  }
  
  const sortByConfirmed = (states_meta, states_names, key) => {
    //used bubble sort used for code readablity
    for (let i = 0; i < states_meta.length; i++) {
      for (let j = i+1; j < states_meta.length; j++) {
        if (states_meta[i].total?.[key[0]] > states_meta[j].total?.[key[0]]) {
          swap(states_meta,states_names,i,j);
        }
      }
    }
  };

  const sortByAffected = (states_meta, states_names, key) => {
    //used bubble sort used for code readablity
    for (let i = 0; i < states_meta.length - 1; i++) {
      for (let j = i+1; j < states_meta.length; j++) {
        //confirmed case divide by total population * 100 give affected %
        let state1_affected =
          (states_meta[i].total?.confirmed / states_meta[i].meta.population) *
          100;
        let state2_affected =
          (states_meta[j].total?.confirmed / states_meta[j].meta.population) *
          100;
        if (state1_affected > state2_affected) {
          swap(states_meta,states_names,i,j);
        }
      }
    }
  };

  const sortByVaccinated = (states_meta, states_names, key) => {
    //used bubble sort used for code readablity
    for (let i = 0; i < states_meta.length - 1; i++) {
      for (let j = i+1; j < states_meta.length; j++) {
        //vaccinated does 1  divide by total population * 100 give vaccinated %
        let state1_vaccinated =
          (states_meta[i].total?.vaccinated1 /
            states_meta[i]?.meta?.population) *
          100;
        let state2_vaccinated =
          (states_meta[j].total?.vaccinated1 /
            states_meta[j]?.meta?.population) *
          100;
        if (state1_vaccinated > state2_vaccinated) {
          swap(states_meta,states_names,i,j);
        }
      }
    }
  };
  //when user clicks sort by
  const sortByUserPreference = (sort_by) => {
    if (sort_by) {
      //separating states meta and name for sorting purpose
      let states_meta = [];
      let states_names = [];

      Object.keys(states)
        .sort()
        .forEach((state_name) => {
          //for some date there is no confirmed,etc so we appending 0 for it for sorting purpose
          if (states[state_name] && states[state_name]["total"]) {
            if (!states[state_name]["total"]) {
              states[state_name]["total"] = {
                confirmed: 0,
                vaccinated1: 0,
                vaccinated2: 0,
              };
            }
            if (!states[state_name]["total"]["confirmed"]) {
              states[state_name]["total"]["confirmed"] = 0;
            }
            if (!states[state_name]["total"]["deceased"]) {
              states[state_name]["total"]["deceased"] = 0;
            }
            if (!states[state_name]["total"]["recovered"]) {
              states[state_name]["total"]["recovered"] = 0;
            }
          }
          states_names.push(state_name);
          states_meta.push(states[state_name]);
        });
      //the key has sort by value and which order seperated by -
      let key = sort_by.split("-");

      if (key[0] === "confirmed") {
        sortByConfirmed(states_meta, states_names, key);
      } else if (key[0] === "affected") {
        sortByAffected(states_meta, states_names, key);
      } else {
        sortByVaccinated(states_meta, states_names, key);
      }

      let new_sorted_states = {};
      //if asec travel from start else in reverse
      if (key[1] === "a") {
        for (let i = 0; i < states_names.length; i++) {
          new_sorted_states[states_names[i]] = { ...states_meta[i] };
        }
      } else {
        for (let i = states_names.length - 1; i >= 0; i--) {
          new_sorted_states[states_names[i]] = { ...states_meta[i] };
        }
      }
      //assingin new states
      setStates(new_sorted_states);

    } else {
      let new_sorted_states = {};
      Object.keys(states)
        .sort()
        .forEach((state_name) => {
          new_sorted_states[state_name] = states[state_name];
        });
      setStates(new_sorted_states);
    }
  };

  const states_card = [];
  //iterating the states
  Object.keys(states).map((state) => {
    //when user searching by state name we need to show only that has match to user typed
    if (!states[state].isHide) {
      states_card.push(
        <StateCard
          key={state}
          state_short_name={state}
          state_name={STATE_NAMES[state]}
          districts={states[state]?.districts}
          confirmed={states[state]?.total?.confirmed}
          recovered={states[state]?.total?.recovered}
          deceased={states[state]?.total?.deceased}
          population={states[state]?.meta?.population}
        />
      );
    }
  });

  return (
    <>
      <SquareLoader loading={loading} />
      <section className="search_container">
        <input
          type="text"
          name="search_input"
          className="search_input"
          onChange={(e) => {
            setFilterState(e.target.value);
            filterState(e.target.value);
          }}
          value={filter_state}
          placeholder="SEARCH HERE..."
        />
        <input
          type="date"
          name="date"
          className="search_date"
          placeholder="Search by date"
          value={filter_date}
          onChange={(e) => {
            setFilterDate(e.target.value);
            getStatesByDate(e.target.value);
          }}
        />

        <div className="filter_option-wrapper">
          <label className="filter_option-label">
            <span>Sort By: </span>
          </label>
          <select
            className="filter_option"
            onChange={(e) => {
              setSortBy(e.target.value);
              sortByUserPreference(e.target.value);
            }}
            defaultValue={sort_by}
          >
            <option value="">None</option>
            <option value="confirmed-a">Confirmed(a-z)</option>
            <option value="confirmed-d">Confirmed(z-a)</option>
            <option value="affected-a">Affected%(a-z)</option>
            <option value="affected-d">Affected%(z-a)</option>
            <option value="vaccinated-a">Vaccinated%(a-z)</option>
            <option value="vaccinated-d">Vaccinated%(z-a)</option>
          </select>
        </div>
      </section>

      <section className="state_container">
        {states_card.length > 0 && !loading && is_valid_date
          ? states_card
          : (!is_valid_date || has_error || !is_find) &&
            msg &&
            !loading && <NoResultCard msg={msg} />}
      </section>
    </>
  );
}

export default Home;

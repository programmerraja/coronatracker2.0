import { React, useEffect, useState } from "react";
import { useParams ,useHistory} from "react-router-dom";

import SquareLoader from "../../components/SquareLoader";
import Table from "../../components/Table";
import StateCard from "../../components/StateCard";
import NoResultCard from "../../components/NoResultCard";

import API from "../../utils/API";
import STATE_NAMES from "../../utils/stateNames";

import "./style.css";

const START_DATE="2020-03-26";
const END_DATE="2020-10-31";

function StateDetail() {

  const [state_data, setStateData] = useState({});
  const [state_dates, setStateDates] = useState([]);
  const [districts, setDistricts] = useState({});
  const [population, setPopulation] = useState(1);
  //for filtering
  const [selected_district, setSelectedDistrict] = useState("none");
  const [sort_by, setSortBy] = useState("none");
  const [filter_date, setFilterDate] = useState("");
  //for UX
  const [is_find, setIsFind] = useState(true);
  const [msg, setMsg] = useState("");
  const [has_error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const { STATE_NAME } = useParams();
  const history=useHistory();

  useEffect(() => {
    let temp_state_name = localStorage.getItem("state_name");
    //if user visiting directly this page
    if(temp_state_name!=STATE_NAMES[STATE_NAME]){
      history.push("/");
    }
    API.getStatesByDate()
      .then((data) => {
        setLoading(false);
        let temp_state_data = {};
        for (const state_name in data) {
          if (state_name === STATE_NAME) {
            temp_state_data[state_name] = data[state_name];
            setStateData(temp_state_data);
          }
        }
      })
      .catch((data) => {
        setLoading(false);
        setError(true);
        setMsg("Error while loading data try refreshing the page");
      });

    //parsing data form local storage
    let temp_district = localStorage.getItem("districts");
    let temp_population = localStorage.getItem("poulation");
    if (temp_district) {
      setDistricts(JSON.parse(temp_district));
    }
    //if no population present redirect the user to home page
    if (temp_population) {
      setPopulation(JSON.parse(temp_population));
    }
  }, []);

  const filterStateByDate = (search_date) => {
    //checking if the date between 2020-03-26 and 2020-10-31
    if (
      new Date(search_date) >= new Date(START_DATE) &&
      new Date(END_DATE) >= new Date(search_date)
    ) {
      let temp_state_data = { ...state_data };
      for (const date in state_data[STATE_NAME]["dates"]) {
        if (date === search_date) {
          temp_state_data[STATE_NAME]["dates"][date].isHide = false;
        } else {
          temp_state_data[STATE_NAME]["dates"][date].isHide = true;
        }
      }
      setStateData({ ...temp_state_data });
      setIsFind(true);
    } else {
      setIsFind(false);
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
  const sortByConfirmed = (states_meta, state_dates, key) => {
    //used bubble sort used for code readablity
    for (let i = 0; i < states_meta.length; i++) {
      for (let j = 0; j < states_meta.length; j++) {
        if (states_meta[i].delta?.[key[0]] < states_meta[j].delta?.[key[0]]) {
          swap(states_meta,states_names,i,j);
        }
      }
    }
  };

  const sortByAffected = (states_meta, state_dates, key) => {
    //used bubble sort used for code readablity
    for (let i = 0; i < states_meta.length; i++) {
      for (let j = 0; j < states_meta.length; j++) {
        //confirmed case divide by total population * 100 give affected %
        let state1_affected =
          (states_meta[i].delta?.confirmed / population) * 100;
        let state2_affected =
          (states_meta[j].delta?.confirmed / population) * 100;
        if (state1_affected < state2_affected) {
          swap(states_meta,states_names,i,j);
        }
      }
    }
  };
  
  const sortByUserPreference = (sort_by) => {
    if (sort_by) {
      //separating states meta and name for sorting purpose
      let states_meta = [];
      let state_dates = [];

      Object.keys(state_data[STATE_NAME]["dates"]).forEach((date) => {
        //for some date there is no confirmed so we appending 0 for it for sorting purpose
        if (
          state_data[STATE_NAME]["dates"][date] &&
          state_data[STATE_NAME]["dates"][date]["delta"]
        ) {
          if (!state_data[STATE_NAME]["dates"][date]["delta"]) {
            state_data[STATE_NAME]["dates"][date]["delta"] = { confirmed: 0 };
          }
        }
        //seperating meta and date data
        state_dates.push(date);
        states_meta.push(state_data[STATE_NAME]["dates"][date]);
      });
      //the key has sort by value and which order seperated by -
      let key = sort_by.split("-");
      if (key[0] === "confirmed") {
        sortByConfirmed(states_meta, state_dates, key);
      } else if (key[0] === "affected") {
        sortByAffected(states_meta, state_dates, key);
      } else {
        sortByVaccinated(states_meta, state_dates, key);
      }
      let new_sorted_state_data = { [STATE_NAME]: { dates: {} } };
      //if asec travel from start else in reverse
      if (key[1] === "a") {
        for (let i = 0; i < state_dates.length; i++) {
          new_sorted_state_data[STATE_NAME]["dates"][state_dates[i]] = {
            ...states_meta[i],
          };
        }
      } else {
        for (let i = state_dates.length - 1; i >= 0; i--) {
          new_sorted_state_data[STATE_NAME]["dates"][state_dates[i]] = {
            ...states_meta[i],
          };
        }
      }
      //if order is d reverse the dates array
      if (key[1] === "d") {
        state_dates.reverse();
      }
      //assingin new states data
      setStateData({ ...new_sorted_state_data });
      //setting dates for displaying the data in sorting order
      setStateDates(state_dates);
    } else {
      let new_sorted_state_data = { [STATE_NAME]: { dates: {} } };
      Object.keys(state_data[STATE_NAME]["dates"])
        .sort()
        .forEach((date) => {
          new_sorted_state_data[STATE_NAME]["dates"][date] =
            state_data[STATE_NAME]["dates"][date];
        });
      setStateData({ ...new_sorted_state_data });
      setStateDates([]);
    }
  };
  
  const clearAllFilter = () => {
    setFilterDate("");
    setSelectedDistrict("none");
    setSortBy("");
    setIsFind(true);
    let temp_state_data = { ...state_data };
    //converting back to false such that it will show all
    for (const date in state_data[STATE_NAME]["dates"]) {
      temp_state_data[STATE_NAME]["dates"][date].isHide = false;
    }
    setStateData({ ...temp_state_data });
  };
  if (state_data && !loading) {
    return (
      <>
        <p className="state_name">{STATE_NAMES[STATE_NAME]}</p>
        <section className="search_container">
          <input
            type="date"
            name="date"
            className="search_date"
            placeholder="Search by date"
            value={filter_date}
            onChange={(e) => {
              setFilterDate(e.target.value);
              filterStateByDate(e.target.value);
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
              <option value="confirmed-a">Confirmed(a-z)based on delta</option>
              <option value="confirmed-d">Confirmed(z-a)based on delta</option>
              <option value="affected-a">Affected%(a-z)based on delta</option>
              <option value="affected-d">Affected%(z-a)based on delta)</option>
            </select>
          </div>
          <div className="filter_option-wrapper">
            <label className="filter_option-label">
              <span>District: </span>
            </label>
            <select
              className="state_card-select"
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
              }}
            >
              <option value="none" defaultValue={selected_district}>
                None
              </option>
              {districts &&
                Object.keys(districts).map((district_name) => {
                  return (
                    <option key={district_name} value={district_name}>
                      {district_name}
                    </option>
                  );
                })}
            </select>
          </div>
          <input
            type="button"
            value="Clear All"
            className="filter_option-clear"
            onClick={clearAllFilter}
          />
        </section>
        <section className="state_container">
          {is_find &&
          selected_district === "none" &&
          Object.keys(state_data).length > 0 ? (
            <Table
              state_data={state_data}
              state_name={STATE_NAME}
              is_filter={filter_date === ""}
              state_dates={state_dates}
            />
          ) : (
            msg && selected_district === "none" && <NoResultCard msg={msg} />
          )}
          {/* for displaying district data */}
          {selected_district != "none" && districts && (
            <StateCard
              confirmed={districts[selected_district]?.total?.confirmed}
              recovered={districts[selected_district]?.total?.recovered}
              deceased={districts[selected_district]?.total?.deceased}
            />
          )}
        </section>
      </>
    );
  } else {
    return (
      <>
        <SquareLoader loading={loading} />
        {msg && <NoResultCard msg={msg} />}
      </>
    );
  }
}

export default StateDetail;

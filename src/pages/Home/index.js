import { React, useEffect, useState } from "react";

import SquareLoader from "../../components/SquareLoader";
import StateCard from "../../components/StateCard";
import NoResultCard from "../../components/NoResultCard";

import API from "../../utils/API";
import STATE_NAMES from "../../utils/stateNames";

import errorHandler from "../../utils/errorHandler";

import "./style.css";

function Home() {
  const [states, setStates] = useState({});
  const [states_time_cache, setStatesCache] = useState(null);
  const [filter_state, setSearchState] = useState("");
  const [filter_date, setFilterDate] = useState("2021-10-31");
  const [sort_by, setSortBy] = useState("none");
  const [msg, setMsg] = useState("");
  const [is_find, setIsFind] = useState(true);
  const [is_valid_date, setValidDate] = useState(true);
  const [loading, setLoading] = useState(true);
  const [has_error, setError] = useState(false);

  useEffect(() => {
    //checking if cache data avaliablle in local storage
    let states_cache = localStorage.getItem("states_cache");
    if (!states_cache) {
      API.getStates()
        .then((res) => {
          setLoading(false);
          setStates(res.data);
          //storing cache in local
          localStorage.setItem("states_cache", JSON.stringify(res.data));
        })
        .catch((res) => {
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

  const getStatesByDate = (filter_date) => {
    //checking if the date between 2020-03-26 and 2020-10-31
    if (
      new Date(filter_date) >= new Date("2020-03-26") &&
      new Date("2021-10-31") >= new Date(filter_date)
    ) {
      //checking if cache data avaliablle in local storage
      if (!states_time_cache) {
        setLoading(true);
        API.getStatesByDate()
          .then((res) => {
            setLoading(false);
            let new_state = {};
            //for some state no data so we adding empty data with info
            let empty_data = {
              total: {
                confirmed: "Data Not Found",
                recovered: "Data Not Found",
                deceased: "Data Not Found",
              },
            };
            Object.keys(res.data).forEach((state) => {
              //if we have data append it else say no data found
              new_state[state] = res.data[state]["dates"][filter_date]
                ? res.data[state]["dates"][filter_date]
                : empty_data;
              //appending districts data to new state
              new_state[state]["districts"] = {
                ...states[state]?.["districts"],
              };
            });
            setStates(new_state);
            //cannot store the huge data in local storage so we storing on state;
            setStatesCache(res.data);
            setValidDate(true);
          })
          .catch((res) => {
            setLoading(false);
            setError(true);
            setMsg("Error while loading data try refreshing the page");
          });
      } else {
        //if cache avalible use it
        let new_state = {};
        //for some state no data so we adding empty data with info
        let empty_data = {
          total: {
            confirmed: "Data Not Found",
            recovered: "Data Not Found",
            deceased: "Data Not Found",
          },
        };
        Object.keys(states_time_cache).forEach((state) => {
          //if we have data append it else say no data found
          new_state[state] = states_time_cache[state]["dates"][filter_date]
            ? states_time_cache[state]["dates"][filter_date]
            : empty_data;
          //appending districts data to new state
          new_state[state]["districts"] = { ...states[state]?.["districts"] };
        });
        //call the function once the state is updated
        setStates(new_state);
        setValidDate(true);
      }
    } else {
      setValidDate(false);
      setMsg("Plse try the date between 2020-03-26 and 2021-10-31");
    }
  };

  const sortByConfirmed = (states_meta, states_names, key) => {
    //used bubble sort used for code readablity
    for (let i = 0; i < states_meta.length; i++) {
      for (let j = 0; j < states_meta.length; j++) {
        if (states_meta[i].total?.[key[0]] < states_meta[j].total?.[key[0]]) {
          //swapping the meta and state name such that it will in sync
          let temp = states_meta[i];
          states_meta[i] = states_meta[j];
          states_meta[j] = temp;

          temp = states_names[i];
          states_names[i] = states_names[j];
          states_names[j] = temp;
        }
      }
    }
  };

  const sortByAffected = (states_meta, states_names, key) => {
    //used bubble sort used for code readablity
    for (let i = 0; i < states_meta.length - 1; i++) {
      for (let j = 0; j < states_meta.length - i - 1; j++) {
        //confirmed case divide by total population * 100 give affected %
        let state1_affected =
          (states_meta[i].total?.confirmed / states_meta[i].meta.population) *
          100;
        let state2_affected =
          (states_meta[j].total?.confirmed / states_meta[j].meta.population) *
          100;
        if (state1_affected < state2_affected) {
          //swapping the meta and state name such that it will in sync
          let temp = states_meta[i];
          states_meta[i] = states_meta[j];
          states_meta[j] = temp;

          temp = states_names[i];
          states_names[i] = states_names[j];
          states_names[j] = temp;
        }
      }
    }
  };

  const sortByVaccinated = (states_meta, states_names, key) => {
    //used bubble sort used for code readablity
    for (let i = 0; i < states_meta.length - 1; i++) {
      for (let j = 0; j < states_meta.length - i - 1; j++) {
        //vaccinated does 1  divide by total population * 100 give vaccinated %
        let state1_vaccinated =
          (states_meta[i].total?.vaccinated1 /
            states_meta[i]?.meta?.population) *
          100;
        let state2_vaccinated =
          (states_meta[j].total?.vaccinated1 /
            states_meta[j]?.meta?.population) *
          100;
        if (state1_vaccinated < state2_vaccinated) {
          //swapping the meta and state name such that it will in sync
          let temp = states_meta[i];
          states_meta[i] = states_meta[j];
          states_meta[j] = temp;

          temp = states_names[i];
          states_names[i] = states_names[j];
          states_names[j] = temp;
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
            setSearchState(e.target.value);
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
            <option value="confirmed-a">Confirmed(asec)</option>
            <option value="confirmed-d">Confirmed(desc)</option>
            <option value="affected-a">Affected(asec)</option>
            <option value="affected-d">Affected(desc)</option>
            <option value="vaccinated-a">Vaccinated(asec)</option>
            <option value="vaccinated-d">Vaccinated(desc)</option>
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

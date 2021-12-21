import { React, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./style.css";

function StateCard({
  state_short_name,
  state_name,
  districts,
  confirmed,
  recovered,
  deceased,
  population,
}) {
  const [d_confirmed, setConfirmed] = useState(confirmed);
  const [d_recovered, setRecovered] = useState(recovered);
  const [d_deceased, setDeceased] = useState(deceased);
  const [t_districts,setDistricts]=useState({});
  const [selected_district, setSelectedDistrict] = useState("none");

  const history = useHistory();

  useEffect(() => {
    setConfirmed(confirmed);
    setRecovered(recovered);
    setDeceased(deceased);
  }, [confirmed, recovered, deceased]);

  const ChangeToDistrictData = (district_name) => {
    for (const name in districts) {
      if (name === district_name) {
        setConfirmed(districts[name].total.confirmed);
        setRecovered(districts[name].total.recovered);
        setDeceased(districts[name].total.deceased);
      }
    }
    //if user select none we need show the state data
    if (district_name === "none") {
      setConfirmed(confirmed);
      setRecovered(recovered);
      setDeceased(deceased);
    }
  };
  
  const storeToLocalStorage = (state_short_name) => {
    //for some state there is no districts so it better to check
    if (districts) {
      localStorage.setItem("districts", JSON.stringify(districts));
    }
    localStorage.setItem("population", population);
    localStorage.setItem("state_name",state_name);
    history.push(`/state/${state_short_name}`);
  };
  
  return (
    <>
      <div className="state_card">
        <div className="state_card-head">
          <p>{state_name}</p>
          {districts && (
            <select
              className="state_card-select"
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                ChangeToDistrictData(e.target.value);
              }}  
              // loading districts only when user focus such that we can avoid rendering 
              //unwanted list
              onFocus={()=>{
                setDistricts(districts);
              }}
            >
              <option value="none" defaultValue={selected_district}>
                None
              </option>
              {t_districts &&
                Object.keys(t_districts).map((district_name) => {
                  return (
                    <option key={district_name} value={district_name}>
                      {district_name}
                    </option>
                  );
                })}
            </select>
          )}
        </div>
        <div className="state_body-wrapper">
            <p>
              Confirmed: {d_confirmed?d_confirmed:"Data Not Found"}
            </p>
            <p>
              Recovered: {d_recovered?d_recovered:"Data Not Found"}
            </p>
            <p>
              Deceased: {d_deceased?d_deceased:"Data Not Found"}
            </p>
        </div>
        {state_short_name && (
          <p
            className="state_card-link"
            onClick={() => {
              storeToLocalStorage(state_short_name);
            }}
          >
            Know More
          </p>
        )}
      </div>
    </>
  );
}

export default StateCard;

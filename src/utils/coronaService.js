import axios from "axios";

export default {
  getStates:function(){
    return axios.get("https://data.covid19india.org/v4/min/data.min.json");
  },
  getStatesByDate:function(){
    return axios.get("https://data.covid19india.org/v4/min/timeseries.min.json");
  }
  
};
export default {
  getStates:function(){
    return fetch("https://data.covid19india.org/v4/min/data.min.json").then(res=>res.json());
  },
  getStatesByDate:function(){
    return fetch("https://data.covid19india.org/v4/min/timeseries.min.json").then(res=>res.json());
  }
  
};
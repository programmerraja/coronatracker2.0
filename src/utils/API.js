import axios from "axios";

import coronaService from "./coronaService";

export default {
  getStates:coronaService.getStates,
  getStatesByDate:coronaService.getStatesByDate
  
};


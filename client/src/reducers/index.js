import { combineReducers } from "redux";

import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
export default combineReducers({
  // With the hep pf this we can get any reducer in state
  alert,
  auth,
  profile,
});

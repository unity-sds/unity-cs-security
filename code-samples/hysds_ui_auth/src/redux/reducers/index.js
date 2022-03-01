import { combineReducers } from "redux";

import generalReducer from "./generalReducer";
import reactivesearchReducer from "./reactivesearchReducer";
import themeReducer from "./themeReducer";

const rootReducer = combineReducers({
  themeReducer,
  generalReducer,
  reactivesearchReducer
});

export default rootReducer;

import { EDIT_THEME } from "../constants";

const initialState = {
  darkMode: localStorage.getItem("dark-mode") === "true" ? true : false
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_THEME:
      return {
        ...state,
        darkMode: action.payload
      };
    default:
      return state;
  }
};

export default themeReducer;

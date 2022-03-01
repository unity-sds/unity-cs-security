import {
  BBOX_EDIT,
  CLEAR_REDUX_STORE,
  CLICK_QUERY_REGION,
  EDIT_CUSTOM_FILTER_ID,
  GET_DATASET_ID,
  UNCLICK_QUERY_REGION,
} from "../constants.js";
import { ID_COMPONENT } from "../../config/tosca";

const initialState = {
  bboxText: null,
  queryRegion: false,
};

const reactivesearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_REDUX_STORE:
      return initialState;

    case GET_DATASET_ID:
      return {
        ...state,
        [ID_COMPONENT]: action.payload,
      };

    case EDIT_CUSTOM_FILTER_ID:
      return {
        ...state,
        ...action.payload,
      };

    case BBOX_EDIT:
      return {
        ...state,
        bboxText: action.payload,
      };

    case CLICK_QUERY_REGION:
      return {
        ...state,
        bboxText: action.payload,
        queryRegion: true,
      };

    case UNCLICK_QUERY_REGION:
      return {
        ...state,
        queryRegion: false,
      };

    default:
      return state;
  }
};

export default reactivesearchReducer;

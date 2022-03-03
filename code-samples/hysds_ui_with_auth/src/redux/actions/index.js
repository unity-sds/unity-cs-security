import {
  GET_DATASET_ID, // reactivesearch
  RETRIEVE_DATA,
  SET_QUERY,
  EDIT_QUERY, // on-demand
  EDIT_PRIORITY,
  EDIT_JOB_PARAMS,
  CHANGE_JOB_TYPE,
  CHANGE_QUEUE,
  EDIT_TAG,
  EDIT_SOFT_TIME_LIMIT,
  EDIT_TIME_LIMIT,
  EDIT_DISK_USAGE,
  EDIT_ENABLE_DEDUP,
  CLEAR_JOB_PARAMS,
  EDIT_RULE_NAME,
  GLOBAL_SEARCH_USER_RULES,
  CHANGE_USER_RULE_TAGS_FILTER,
  BBOX_EDIT,
  CLICK_QUERY_REGION,
  UNCLICK_QUERY_REGION,
  EDIT_THEME,
  EDIT_CUSTOM_FILTER_ID,
  CLEAR_REDUX_STORE,
  CHANGE_USER_RULE_TAG,
} from "../constants.js";

import {
  constructUrl,
  clearUrlJobParams,
  editUrlJobParam,
  validateUrlQueryParam,
} from "../../utils";

// REACTIVESEARCH ACTIONS
export const clearReduxStore = () => ({
  type: CLEAR_REDUX_STORE,
});

export const clickDatasetId = (id) => ({
  type: GET_DATASET_ID,
  payload: id,
});

export const editCustomFilterId = (componentId, value) => ({
  type: EDIT_CUSTOM_FILTER_ID,
  payload: {
    [componentId]: value,
  },
});

// TOSCA ACTIONS
export const retrieveData = (data) => ({
  type: RETRIEVE_DATA,
  payload: data,
});

export const setQuery = (query) => {
  return {
    type: SET_QUERY,
    payload: query,
  };
};

// TOSCA ON DEMAND ACTIONS
export const editQuery = (payload, url = false) => {
  if (url) validateUrlQueryParam(payload);
  return {
    type: EDIT_QUERY,
    payload,
  };
};

export const editJobPriority = (payload, url = false) => {
  if (url) constructUrl("priority", payload);
  return {
    type: EDIT_PRIORITY,
    payload,
  };
};

export const changeJobType = (payload, url = false) => {
  if (url) {
    clearUrlJobParams(payload);
    constructUrl("job_spec", payload.jobSpec);
    constructUrl("hysds_io", payload.hysdsio);
  }
  return {
    type: CHANGE_JOB_TYPE,
    payload,
  };
};

export const changeQueue = (payload) => ({
  type: CHANGE_QUEUE,
  payload,
});

export const editTags = (payload, url = false) => {
  if (url) constructUrl("tags", payload);
  return {
    type: EDIT_TAG,
    payload,
  };
};

export const editSoftTimeLimit = (payload) => ({
  type: EDIT_SOFT_TIME_LIMIT,
  payload,
});

export const editTimeLimit = (payload) => ({
  type: EDIT_TIME_LIMIT,
  payload,
});

export const editDiskUsage = (payload) => ({
  type: EDIT_DISK_USAGE,
  payload,
});

export const editDedup = (payload) => ({
  type: EDIT_ENABLE_DEDUP,
  payload,
});

export const editParams = (payload, url = false) => {
  const { name, value } = payload;
  if (url) editUrlJobParam(name, value);
  return {
    type: EDIT_JOB_PARAMS,
    payload,
  };
};

export const clearParams = (payload) => ({
  type: CLEAR_JOB_PARAMS,
  payload,
});

export const editRuleName = (payload, url = false) => {
  if (url) constructUrl("rule_name", payload);
  return {
    type: EDIT_RULE_NAME,
    payload,
  };
};

export const globalSearchUserRules = (string) => ({
  type: GLOBAL_SEARCH_USER_RULES,
  payload: string,
});

export const changeUserRuleTagsFilter = (value) => ({
  type: CHANGE_USER_RULE_TAGS_FILTER,
  payload: value,
});

export const changeUserRuleTag = (tag) => ({
  type: CHANGE_USER_RULE_TAG,
  payload: tag,
});

export const bboxEdit = (bbox) => ({
  type: BBOX_EDIT,
  payload: bbox,
});

export const clickQueryRegion = (bbox) => ({
  type: CLICK_QUERY_REGION,
  payload: bbox,
});

export const unclickQueryRegion = () => ({
  type: UNCLICK_QUERY_REGION,
});

export const editTheme = (darkMode) => ({
  type: EDIT_THEME,
  payload: darkMode,
});

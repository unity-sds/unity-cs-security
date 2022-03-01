import {
  CHANGE_JOB_TYPE,
  CHANGE_QUEUE,
  CLEAR_JOB_PARAMS,
  CLEAR_REDUX_STORE,
  DELETE_USER_RULE,
  EDIT_DATA_COUNT,
  EDIT_JOB_PARAMS,
  EDIT_PRIORITY,
  EDIT_QUERY,
  EDIT_RULE_NAME,
  EDIT_TAG,
  EDIT_SOFT_TIME_LIMIT,
  EDIT_TIME_LIMIT,
  LOAD_TIME_LIMITS,
  EDIT_DISK_USAGE,
  LOAD_DISK_USAGE,
  EDIT_ENABLE_DEDUP,
  GET_JOB_LIST,
  SET_QUERY,
  GLOBAL_SEARCH_USER_RULES,
  LOAD_JOB_PARAMS,
  LOAD_QUEUE,
  LOAD_QUEUE_LIST,
  LOAD_USER_RULE,
  LOAD_USER_RULES,
  RETRIEVE_DATA,
  TOGGLE_USER_RULE,
  USER_RULE_ACTION_LOADING,
  JOB_COUNTS,
  LOAD_USER_RULES_TAGS,
  CHANGE_USER_RULE_TAGS_FILTER,
  CHANGE_USER_RULE_TAG,
} from "../constants";

import {
  makeDropdownOptions,
  sanitizePriority,
  extractJobParams,
} from "../../utils";

const urlParams = new URLSearchParams(window.location.search);

let priority = urlParams.get("priority");
priority = sanitizePriority(priority);

let defaultUrlJobParams = extractJobParams(urlParams);

const initialState = {
  // main page
  data: [],
  dataCount: urlParams.get("total") || 0,
  jobCounts: {},

  // form data
  query: urlParams.get("query") || "",
  validQuery: true,
  priority: priority || 0,
  priorityList: [...Array(10).keys()].map((n) => ({ value: n, label: n })),
  jobList: [],
  jobLabel: null,
  jobSpec: urlParams.get("job_spec") || null,
  hysdsio: urlParams.get("hysds_io") || null,
  queueList: [],
  queue: null,
  paramsList: [],
  params: defaultUrlJobParams || {},
  submissionType: null,
  tags: urlParams.get("tags") || "",
  softTimeLimit: "",
  timeLimit: "",
  diskUsage: "",
  dedup: true,
  ruleName: "",

  // user rule filters
  userRules: [], // store all the rules client side
  filteredRules: [], // client global search for user rules
  userRuleSearch: "",
  userRulesTags: [], // aggregated rules from elasticsearch
  userRuleTagFilter: null,
  userRuleTag: [], // tags for individual user rule
};

const filterUserRules = (rules, string, tag) => {
  let rulesFiltered = rules;

  if (string) {
    rulesFiltered = rules.filter((value) => {
      return (
        (value.rule_name &&
          value.rule_name.toLowerCase().includes(string.toLowerCase())) ||
        (value.job_spec &&
          value.job_spec.toLowerCase().includes(string.toLowerCase())) ||
        (value.queue &&
          value.queue.toLowerCase().includes(string.toLowerCase())) ||
        (value.query_string &&
          value.query_string.toLowerCase().includes(string.toLowerCase())) ||
        (value.kwargs &&
          value.kwargs.toLowerCase().includes(string.toLowerCase())) ||
        (value.job_type &&
          value.job_type.toLowerCase().includes(string.toLowerCase())) ||
        (value.username &&
          value.username.toLowerCase().includes(string.toLowerCase())) ||
        (value.modified_time &&
          value.modified_time.toLowerCase().includes(string.toLowerCase())) ||
        (value.creation_time &&
          value.creation_time.toLowerCase().includes(string.toLowerCase()))
      );
    });
  }

  if (tag) {
    rulesFiltered = rulesFiltered.filter((rule) => {
      if (rule.tags) {
        if (rule.tags.indexOf(tag) > -1) return true;
        else return false;
      } else {
        return false;
      }
    });
  }
  return rulesFiltered;
};

const generalReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_REDUX_STORE:
      return initialState;

    case RETRIEVE_DATA:
      return {
        ...state,
        data: action.payload.data,
        dataCount: action.payload.resultStats.numberOfResults,
      };
    case JOB_COUNTS:
      return {
        ...state,
        jobCounts: action.payload,
      };
    case SET_QUERY:
      return {
        ...state,
        query: action.payload,
      };

    case EDIT_QUERY:
      return {
        ...state,
        query: action.payload,
      };
    case GET_JOB_LIST: {
      const newJobList = makeDropdownOptions(action.payload);
      return {
        ...state,
        jobList: newJobList,
      };
    }
    case LOAD_JOB_PARAMS: {
      const { payload } = action;
      const params = payload.params || [];
      const { enable_dedup } = payload;
      const defaultParams = {};
      params.map((p) => {
        let name = p.name;
        defaultParams[name] = state.params[name] || p.default || null;
      });

      const newState = {
        paramsList: params,
        submissionType: payload.submission_type,
        params: defaultParams,
      };
      if (enable_dedup !== undefined) newState.dedup = enable_dedup;

      return {
        ...state,
        ...newState,
      };
    }
    case LOAD_TIME_LIMITS: {
      const { softTimeLimit, timeLimit } = action.payload;
      return {
        ...state,
        softTimeLimit: softTimeLimit || "",
        timeLimit: timeLimit || "",
      };
    }
    case CHANGE_JOB_TYPE:
      return {
        ...state,
        jobSpec: action.payload.jobSpec,
        jobLabel: action.payload.label,
        hysdsio: action.payload.hysdsio,
        queue: null,
        queueList: [],
        params: {},
      };
    case LOAD_QUEUE_LIST:
      return {
        ...state,
        queueList: action.payload.map((queue) => ({
          label: queue,
          value: queue,
        })),
      };
    case LOAD_QUEUE: {
      const queues = action.payload;
      const recommendedQueue = queues.length > 0 ? queues[0] : state.queue;
      return {
        ...state,
        queue: recommendedQueue,
      };
    }
    case CHANGE_QUEUE:
      return {
        ...state,
        queue: action.payload,
      };
    case EDIT_PRIORITY:
      return {
        ...state,
        priority: action.payload,
      };
    case EDIT_TAG:
      return {
        ...state,
        tags: action.payload,
      };
    case EDIT_SOFT_TIME_LIMIT: {
      return {
        ...state,
        softTimeLimit: action.payload || "",
      };
    }
    case EDIT_TIME_LIMIT: {
      return {
        ...state,
        timeLimit: action.payload || "",
      };
    }
    case EDIT_DISK_USAGE:
    case LOAD_DISK_USAGE: {
      return {
        ...state,
        diskUsage: action.payload || "",
      };
    }
    case EDIT_ENABLE_DEDUP: {
      return {
        ...state,
        dedup: action.payload,
      };
    }
    case EDIT_JOB_PARAMS: {
      const newParams = {
        ...state.params,
        ...{ [action.payload.name]: action.payload.value },
      };
      return {
        ...state,
        params: newParams,
      };
    }
    case EDIT_DATA_COUNT:
      return {
        ...state,
        dataCount: action.payload,
      };
    case LOAD_USER_RULES:
      return {
        ...state,
        userRules: action.payload,
        filteredRules: action.payload,
      };
    case LOAD_USER_RULE: {
      const { payload } = action;
      return {
        ...state,
        query: payload.query_string,
        jobSpec: payload.job_spec,
        jobLabel: payload.job_spec,
        hysdsio: payload.job_type,
        params: JSON.parse(payload.kwargs),
        ruleName: payload.rule_name,
        queue: payload.queue,
        priority: payload.priority,
        userRuleTag: payload.tags || [],
        dedup: payload.enable_dedup !== undefined ? payload.enable_dedup : null,
      };
    }
    case LOAD_USER_RULES_TAGS: {
      const tags = action.payload.map((tag) => ({
        value: tag.key,
        label: `${tag.key} (${tag.count})`,
      }));
      return {
        ...state,
        userRulesTags: tags,
      };
    }
    case USER_RULE_ACTION_LOADING: {
      const { index, id } = action.payload;

      const foundFilteredRule = state.filteredRules[index];
      foundFilteredRule.toggleLoading = true;

      const loc = state.userRules.findIndex((x) => x._id === id);
      const foundRule = state.userRules[loc];
      foundRule.toggleLoading = true;

      return {
        ...state,
        userRules: [
          ...state.userRules.slice(0, loc),
          foundRule,
          ...state.userRules.slice(loc + 1),
        ],
        filteredRules: [
          ...state.filteredRules.slice(0, index),
          foundFilteredRule,
          ...state.filteredRules.slice(index + 1),
        ],
      };
    }
    case TOGGLE_USER_RULE: {
      const { index, id, updated } = action.payload;

      const loc = state.userRules.findIndex((x) => x._id === id);
      const foundRule = state.userRules[loc];
      foundRule.enabled = updated.enabled;
      foundRule.toggleLoading = false;

      const foundFilteredRule = state.filteredRules[index];
      foundFilteredRule.enabled = updated.enabled;
      foundFilteredRule.toggleLoading = false;

      return {
        ...state,
        userRules: [
          ...state.userRules.slice(0, loc),
          foundRule,
          ...state.userRules.slice(loc + 1),
        ],
        filteredRules: [
          ...state.filteredRules.slice(0, index),
          foundFilteredRule,
          ...state.filteredRules.slice(index + 1),
        ],
      };
    }
    case CLEAR_JOB_PARAMS:
      return {
        ...state,
        jobSpec: null,
        hysdsio: null,
        queue: null,
        queueList: [],
        queue: null,
        params: {},
        paramsList: [],
      };
    case EDIT_RULE_NAME:
      return {
        ...state,
        ruleName: action.payload,
      };
    case DELETE_USER_RULE: {
      const { index, id } = action.payload;
      const loc = state.userRules.findIndex((x) => x._id === id);

      return {
        ...state,
        userRules: [
          ...state.userRules.slice(0, loc),
          ...state.userRules.slice(loc + 1),
        ],
        filteredRules: [
          ...state.filteredRules.slice(0, index),
          ...state.filteredRules.slice(index + 1),
        ],
      };
    }
    case GLOBAL_SEARCH_USER_RULES: {
      const { userRules, userRuleTagFilter } = state;
      const search = action.payload;

      let filteredRules = filterUserRules(userRules, search, userRuleTagFilter);
      return {
        ...state,
        userRuleSearch: search,
        filteredRules,
      };
    }
    case CHANGE_USER_RULE_TAG: {
      const tags = action.payload.map((tag) => tag.value);
      return {
        ...state,
        userRuleTag: tags,
      };
    }
    case CHANGE_USER_RULE_TAGS_FILTER: {
      const { userRules, userRuleSearch } = state;

      let filteredRules = filterUserRules(
        userRules,
        userRuleSearch,
        action.payload
      );
      return {
        ...state,
        userRuleTagFilter: action.payload,
        filteredRules,
      };
    }

    default:
      return state;
  }
};

export default generalReducer;

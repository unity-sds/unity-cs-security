import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { ButtonLink } from "../../components/Buttons";
import UserRulesTable from "../../components/UserRulesTable";
import UserRulesTagsFilter from "../../components/UserRulesTagsFilter";

import {
  globalSearchUserRules,
  changeUserRuleTagsFilter,
} from "../../redux/actions";
import {
  getUserRules,
  toggleUserRule,
  deleteUserRule,
  getUserRulesTags,
} from "../../redux/actions/figaro";

import HeaderBar from "../../components/HeaderBar";

import "./style.css";

const FigaroUserRules = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      globalSearch: "",
    };
  }

  componentDidMount() {
    this.props.getUserRules();
    this.props.getUserRulesTags();
  }

  handleRuleSearch = (e) => {
    const text = e.target.value;
    this.setState({
      globalSearch: text,
    });
    this.props.globalSearchUserRules(text);
  };

  render() {
    const { darkMode, userRules, userRuleSearch, userRuleTagFilter } =
      this.props;
    const classTheme = darkMode ? "__theme-dark" : "__theme-light";
    const searchDisabled = userRules.length === 0 && !this.state.globalSearch;
    const tagFilters = [{ value: null, label: "-" }, ...this.props.tags];
    const ruleCount = userRules.length;

    return (
      <div className="figaro-user-rules">
        <Helmet>
          <title>Mozart - User Rules</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
        <HeaderBar title="HySDS - User Rules" theme={classTheme} />

        <div className="user-rules-body">
          <div style={{ textAlign: "center" }}>
            <h1>
              Mozart - User Rules {ruleCount > 0 ? `(${ruleCount})` : null}
            </h1>
          </div>
          <div className="user-rules-options-wrapper">
            <input
              className="user-rules-global-search"
              placeholder="Search..."
              onChange={this.handleRuleSearch}
              disabled={searchDisabled}
              value={userRuleSearch}
            />

            <UserRulesTagsFilter
              darkMode={darkMode}
              tag={userRuleTagFilter}
              tags={tagFilters}
              changeUserRuleTagsFilter={changeUserRuleTagsFilter}
            />

            <div className="user-rules-button-wrapper">
              <ButtonLink href="/figaro/user-rule" label="Create Rule" />
            </div>
          </div>

          <div className="user-rules-table-wrapper">
            <UserRulesTable
              rules={userRules}
              toggleUserRule={toggleUserRule}
              deleteUserRule={deleteUserRule}
              link="/figaro/user-rule"
            />
          </div>
        </div>
      </div>
    );
  }
};

FigaroUserRules.propTypes = {
  getUserRules: PropTypes.func.isRequired,
  userRules: PropTypes.array.isRequired,
};

// redux state data
const mapStateToProps = (state) => ({
  darkMode: state.themeReducer.darkMode,
  userRules: state.generalReducer.filteredRules,
  userRuleSearch: state.generalReducer.userRuleSearch,
  userRuleTagFilter: state.generalReducer.userRuleTagFilter,
  tags: state.generalReducer.userRulesTags,
});

const mapDispatchToProps = (dispatch) => ({
  getUserRules: () => dispatch(getUserRules()),
  getUserRulesTags: () => dispatch(getUserRulesTags()),
  globalSearchUserRules: (search) => dispatch(globalSearchUserRules(search)),
  changeUserRuleTagsFilter: (tag) => dispatch(changeUserRuleTagsFilter(tag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FigaroUserRules);

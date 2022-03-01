import React from "react";
import { connect } from "react-redux";

import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";

import Tosca from "../Tosca";
import ToscaOnDemand from "../ToscaOnDemand";
import ToscaUserRules from "../ToscaUserRules";
import ToscaRuleEditor from "../ToscaRuleEditor";

import Figaro from "../Figaro";
import FigaroOnDemand from "../FigaroOnDemand";
import FigaroUserRules from "../FigaroUserRules";
import FigaroRuleEditor from "../FigaroRuleEditor";

import MetadataViewer from "../MetadataViewer";

import NotFound from "../NotFound";

import { ROOT_PATH } from "../../config/index.js";

import "./style.css";

const Routes = (props) => {
  const classTheme = props.darkMode ? "__theme-dark" : "__theme-light";

  return (
    <div className={classTheme}>
      <Router basename={ROOT_PATH}>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/tosca" />} />
          <Route exact path="/tosca" component={Tosca} />
          <Route exact path="/tosca/on-demand" component={ToscaOnDemand} />
          <Route
            exact
            path="/tosca/metadata/:index/:id"
            component={MetadataViewer}
          />
          <Route exact path="/tosca/user-rules" component={ToscaUserRules} />
          <Route exact path="/tosca/user-rule" component={ToscaRuleEditor} />
          <Route
            exact
            path="/tosca/user-rule/:rule"
            component={ToscaRuleEditor}
          />

          <Route exact path="/figaro" component={Figaro} />
          <Route exact path="/figaro/on-demand" component={FigaroOnDemand} />
          <Route exact path="/figaro/user-rules" component={FigaroUserRules} />
          <Route exact path="/figaro/user-rule" component={FigaroRuleEditor} />
          <Route
            exact
            path="/figaro/user-rule/:rule"
            component={FigaroRuleEditor}
          />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
};

const mapStateToProps = (state) => ({
  darkMode: state.themeReducer.darkMode,
});

export default connect(mapStateToProps)(Routes);

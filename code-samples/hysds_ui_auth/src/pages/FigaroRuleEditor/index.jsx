import React from "react";
import { Helmet } from "react-helmet";

import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import QueryEditor from "../../components/QueryEditor";
import JobInput from "../../components/JobInput";
import Params from "../../components/Form/Params";
import Tags from "../../components/Form/Tags";
import Input from "../../components/Form/Input";
import Dropdown from "../../components/Form/Dropdown";

import { Button, ButtonLink } from "../../components/Buttons";
import { Border, SubmitStatusBar } from "../../components/miscellaneous";

import HeaderBar from "../../components/HeaderBar";

import {
  editQuery,
  editJobPriority,
  changeJobType,
  editParams,
  changeQueue,
  editRuleName,
  clearParams,
  changeUserRuleTag,
  editSoftTimeLimit,
  editTimeLimit,
  editDiskUsage,
  editDedup,
} from "../../redux/actions";
import {
  getUserRule,
  getOnDemandJobs,
  getParamsList,
  getQueueList,
  getUserRulesTags,
} from "../../redux/actions/figaro";

import { buildParams, validateUserRule } from "../../utils";
import { MOZART_REST_API_V1 } from "../../config";

import "./style.css";

class FigaroRuleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitInProgress: 0,
      submitSuccess: 0,
      submitFailed: 0,
      failureReason: "",
      editMode: props.match.params.rule ? true : false,
    };
  }

  componentDidMount() {
    this.props.editDedup(null);
    const params = this.props.match.params;
    if (params.rule) {
      this.props.getUserRule(params.rule);
      this.props.getQueueList(params.rule);
    }
    this.props.getOnDemandJobs();
    if (this.props.tags.length === 0) this.props.getUserRulesTags();
  }

  handleUserRuleSubmit = () => {
    let { paramsList, params } = this.props;
    const ruleId = this.props.match.params.rule;

    let newParams = {};
    try {
      newParams = buildParams(paramsList, params);
    } catch (err) {
      this.setState({
        submitInProgress: 0,
        submitFailed: 1,
        failureReason: err,
      });
      setTimeout(() => this.setState({ submitFailed: 0 }), 3000);
      return;
    }

    const data = {
      id: ruleId,
      rule_name: this.props.ruleName,
      tags: this.props.tag,
      query_string: this.props.query,
      priority: this.props.priority,
      workflow: this.props.hysdsio,
      job_spec: this.props.jobSpec,
      queue: this.props.queue,
      kwargs: JSON.stringify(newParams),
      time_limit: parseInt(this.props.timeLimit) || null,
      soft_time_limit: parseInt(this.props.softTimeLimit) || null,
      disk_usage: this.props.diskUsage || null,
      enable_dedup: this.props.dedup,
    };

    this.setState({ submitInProgress: 1 });

    const endpoint = `${MOZART_REST_API_V1}/user-rules`;
    const headers = { "Content-Type": "application/json" };
    const method = this.state.editMode ? "PUT" : "POST";
    fetch(endpoint, {
      headers,
      method,
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          this.setState({
            submitInProgress: 0,
            submitFailed: 1,
            failureReason: data.message,
          });
          setTimeout(() => this.setState({ submitFailed: 0 }), 3000);
        } else {
          this.props.clearParams();
          this.setState({
            submitInProgress: 0,
            submitSuccess: 1,
            failureReason: "",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({ submitInProgress: 0, submitFailed: 1 });
        setTimeout(() => this.setState({ submitFailed: 0 }), 3000);
      });
  };

  render() {
    const { darkMode } = this.props;
    if (this.state.submitSuccess) return <Redirect to="/figaro/user-rules" />;

    const hysdsioLabel =
      this.props.paramsList.length > 0 ? <h2>{this.props.hysdsio}</h2> : null;
    const validSubmission = validateUserRule(this.props);

    const classTheme = darkMode ? "__theme-dark" : "__theme-light";

    return (
      <div className="figaro-user-rule-editor-page">
        <Helmet>
          <title>Mozart - Rule Editor</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
        <HeaderBar title="HySDS - User Rules" theme={classTheme} />

        <div className="figaro-user-rule-editor">
          <div className="split user-rule-editor-left">
            <QueryEditor
              url={!this.state.editMode}
              editQuery={editQuery}
              query={this.props.query}
            />
          </div>

          <div className="split user-rule-editor-right">
            <div className="user-rule-editor-right-wrapper">
              <h1>Mozart - User Rule Editor</h1>
              <Input
                label="Rule Name"
                value={this.props.ruleName}
                editValue={editRuleName}
                placeholder="Required"
              />
              <Tags
                value={this.props.tag}
                options={this.props.tags}
                changeTag={changeUserRuleTag}
              />
              <JobInput
                changeJobType={changeJobType} // all redux actions
                getParamsList={getParamsList}
                getQueueList={getQueueList}
                jobs={this.props.jobs}
                jobSpec={this.props.jobSpec}
                jobLabel={this.props.jobLabel}
              />
              <Dropdown
                label="Queue"
                value={this.props.queue}
                options={this.props.queueList}
                editValue={changeQueue}
                required
              />
              <Dropdown
                label="Priority"
                value={this.props.priority}
                options={this.props.priorityList}
                editValue={editJobPriority}
              />
              {this.props.paramsList.length > 0 ? <Border /> : null}
              {hysdsioLabel}
              <Params
                editParams={editParams}
                paramsList={this.props.paramsList}
                params={this.props.params}
              />

              {this.props.jobSpec ? <Border /> : null}
              {this.props.jobSpec ? (
                <>
                  <Input
                    label="Soft Time Limit"
                    value={this.props.softTimeLimit}
                    url={true}
                    editValue={editSoftTimeLimit}
                    type="number"
                    min={1}
                    placeholder="(seconds)"
                  />
                  <Input
                    label="Time Limit"
                    value={this.props.timeLimit}
                    url={true}
                    editValue={editTimeLimit}
                    type="number"
                    min={1}
                    placeholder="(seconds)"
                  />
                  <Input
                    label="Disk Usage"
                    value={this.props.diskUsage}
                    editValue={editDiskUsage}
                    placeholder="(KB, MB, GB)"
                  />
                  <Dropdown
                    label="Enable Dedup"
                    value={this.props.dedup}
                    editValue={editDedup}
                    options={[
                      { value: true, label: "true" },
                      { value: false, label: "false" },
                      { value: null, label: "<none>" },
                    ]}
                  />
                </>
              ) : null}

              <div className="user-rule-buttons-wrapper">
                <div className="user-rule-button">
                  <Button
                    size="large"
                    label={this.state.editMode ? "Save Changes" : "Save"}
                    onClick={this.handleUserRuleSubmit}
                    loading={this.state.submitInProgress}
                    disabled={!validSubmission || this.state.submitInProgress}
                  />
                </div>
                <div className="user-rule-button">
                  <ButtonLink
                    color="fail"
                    label="Cancel"
                    size="large"
                    href="/figaro/user-rules"
                    onClick={() => this.props.clearParams()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <SubmitStatusBar
          label="User Rule Submission Failed"
          reason={this.state.failureReason}
          visible={this.state.submitFailed}
          status="failed"
        />
      </div>
    );
  }
}

// redux state data
const mapStateToProps = (state) => ({
  darkMode: state.themeReducer.darkMode,
  userRules: state.generalReducer.userRules,
  query: state.generalReducer.query,
  validQuery: state.generalReducer.validQuery,
  jobs: state.generalReducer.jobList,
  jobSpec: state.generalReducer.jobSpec,
  jobLabel: state.generalReducer.jobLabel,
  hysdsio: state.generalReducer.hysdsio,
  queueList: state.generalReducer.queueList,
  queue: state.generalReducer.queue,
  priority: state.generalReducer.priority,
  priorityList: state.generalReducer.priorityList,
  paramsList: state.generalReducer.paramsList,
  params: state.generalReducer.params,
  ruleName: state.generalReducer.ruleName,
  tag: state.generalReducer.userRuleTag,
  tags: state.generalReducer.userRulesTags,
  softTimeLimit: state.generalReducer.softTimeLimit,
  timeLimit: state.generalReducer.timeLimit,
  diskUsage: state.generalReducer.diskUsage,
  dedup: state.generalReducer.dedup,
});

const mapDispatchToProps = (dispatch) => ({
  getUserRule: (id) => dispatch(getUserRule(id)),
  getOnDemandJobs: () => dispatch(getOnDemandJobs()),
  clearParams: () => dispatch(clearParams()),
  getQueueList: (jobSpec) => dispatch(getQueueList(jobSpec)),
  getUserRulesTags: () => dispatch(getUserRulesTags()),
  changeUserRuleTag: (tag) => dispatch(changeUserRuleTag(tag)),
  editDedup: (val) => dispatch(editDedup(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FigaroRuleEditor);

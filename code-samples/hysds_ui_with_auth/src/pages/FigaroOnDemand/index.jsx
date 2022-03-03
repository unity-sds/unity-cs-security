import React from "react";
import { Helmet } from "react-helmet";

import QueryEditor from "../../components/QueryEditor";
import JobInput from "../../components/JobInput";
import Params from "../../components/Form/Params";
import { Border, SubmitStatusBar } from "../../components/miscellaneous";

import Input from "../../components/Form/Input";
import Dropdown from "../../components/Form/Dropdown";

import { Button } from "../../components/Buttons";
import HeaderBar from "../../components/HeaderBar";

import { connect } from "react-redux";
import {
  changeJobType,
  changeQueue,
  editJobPriority,
  editParams,
  editQuery,
  editTags,
  editSoftTimeLimit,
  editTimeLimit,
  editDiskUsage,
  editDedup,
} from "../../redux/actions";
import {
  getOnDemandJobs,
  getQueueList,
  getParamsList,
  editDataCount,
} from "../../redux/actions/figaro";

import { buildParams, validateSubmission } from "../../utils";
import { MOZART_REST_API_V1 } from "../../config";

import "./style.css";

class FigaroOnDemand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitInProgress: 0,
      submitSuccess: 0,
      submitFailed: 0,
      failureReason: "",
    };
  }

  componentDidMount() {
    const { jobSpec } = this.props;
    this.props.getOnDemandJobs();
    if (jobSpec) {
      this.props.getQueueList(jobSpec);
      this.props.getParamsList(jobSpec);
    }
  }

  checkQueryDataCount = () => this.props.editDataCount(this.props.query);

  handleJobSubmit = () => {
    let { paramsList, params } = this.props;

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
      tags: this.props.tags,
      job_type: this.props.hysdsio,
      hysds_io: this.props.hysdsio,
      queue: this.props.queue,
      priority: this.props.priority,
      query: this.props.query,
      kwargs: JSON.stringify(newParams),
      enable_dedup: this.props.dedup,
    };

    if (this.props.timeLimit) data.time_limit = parseInt(this.props.timeLimit);

    if (this.props.softTimeLimit)
      data.soft_time_limit = parseInt(this.props.softTimeLimit);

    if (this.props.diskUsage) data.disk_usage = this.props.diskUsage;

    const headers = { "Content-Type": "application/json" };
    const jobSubmitUrl = `${MOZART_REST_API_V1}/on-demand`;

    this.setState({ submitInProgress: 1 });
    fetch(jobSubmitUrl, { method: "POST", headers, body: JSON.stringify(data) })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data.success) {
          this.setState({ submitInProgress: 0, submitFailed: 1 });
          setTimeout(() => this.setState({ submitFailed: 0 }), 3000);
        } else {
          this.setState({ submitInProgress: 0, submitSuccess: 1 });
          setTimeout(() => this.setState({ submitSuccess: 0 }), 3000);
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ submitInProgress: 0, submitFailed: 1 });
        setTimeout(() => this.setState({ submitFailed: 0 }), 3000);
      });
  };

  render() {
    const { darkMode, query, paramsList, params, hysdsio, submissionType } =
      this.props;
    const { submitInProgress, submitSuccess, submitFailed } = this.state;

    const hysdsioLabel = paramsList.length > 0 ? <h2>{hysdsio}</h2> : null;

    const submissionTypeLabel = this.props.jobSpec ? (
      <div className="on-demand-submission-type">
        <p>
          Submit Type: <strong>{submissionType || "iteration"}</strong>
        </p>
      </div>
    ) : null;

    const validSubmission = validateSubmission(this.props);

    const classTheme = darkMode ? "__theme-dark" : "__theme-light";

    return (
      <div className="figaro-on-demand-page">
        <Helmet>
          <title>Figaro - On Demand</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
        <HeaderBar title="HySDS - On Demand" theme={classTheme} />

        <div className={classTheme}>
          <div className="figaro-on-demand">
            <div className="split on-demand-left">
              <QueryEditor url={true} query={query} editQuery={editQuery} />
            </div>

            <div className="split on-demand-right">
              <div className="on-demand-submitter-wrapper">
                <h1>Figaro - On-Demand Job</h1>
                <div className="data-count-header">
                  Total Records: {this.props.dataCount || "N/A"}
                </div>

                <Input
                  label="Tag"
                  value={this.props.tags}
                  editValue={editTags}
                  placeholder="Required"
                  url={true}
                  required
                />
                <div className="on-demand-select-wrapper">
                  <JobInput
                    url={true}
                    changeJobType={changeJobType} // all redux actions
                    getParamsList={getParamsList}
                    getQueueList={getQueueList}
                    jobs={this.props.jobs}
                    jobSpec={this.props.jobSpec}
                    jobLabel={this.props.jobLabel}
                  />
                </div>
                <div className="on-demand-select-wrapper">
                  <Dropdown
                    label="Queue"
                    value={this.props.queue}
                    options={this.props.queueList}
                    editValue={changeQueue}
                    required
                  />
                </div>
                <div className="on-demand-select-wrapper">
                  <Dropdown
                    label="Priority"
                    url={true}
                    value={this.props.priority}
                    options={this.props.priorityList}
                    editValue={editJobPriority}
                  />
                </div>
                {paramsList.length > 0 ? <Border /> : null}
                {hysdsioLabel}
                <Params
                  url={true}
                  editParams={editParams}
                  paramsList={paramsList}
                  params={params}
                />
                {this.props.jobSpec ? (
                  <>
                    <Border />
                    <Input
                      label="Soft Time Limit"
                      value={this.props.softTimeLimit}
                      editValue={editSoftTimeLimit}
                      type="number"
                      min={1}
                      placeholder="(seconds)"
                    />
                    <Input
                      label="Time Limit"
                      value={this.props.timeLimit}
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
                      ]}
                    />
                  </>
                ) : null}

                <div className="tosca-on-demand-button-wrapper">
                  <div className="tosca-on-demand-button">
                    <Button
                      size="large"
                      label={"Submit"}
                      onClick={this.handleJobSubmit}
                      loading={submitInProgress}
                      disabled={!validSubmission || submitInProgress}
                    />
                  </div>
                  <div className="tosca-on-demand-button">
                    <Button
                      size="large"
                      color="success"
                      label="Data Count Check"
                      onClick={this.checkQueryDataCount}
                    />
                  </div>
                  <div className="tosca-on-demand-button">
                    <Button
                      size="large"
                      color="fail"
                      label="Cancel"
                      onClick={() => window.close()}
                    />
                  </div>
                  {submissionTypeLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
        <SubmitStatusBar label="Job Submitted!" visible={submitSuccess} />
        <SubmitStatusBar
          label="Job Submission Failed"
          visible={submitFailed}
          status="failed"
          reason={this.state.failureReason}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  darkMode: state.themeReducer.darkMode,
  query: state.generalReducer.query,
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
  tags: state.generalReducer.tags,
  submissionType: state.generalReducer.submissionType,
  softTimeLimit: state.generalReducer.softTimeLimit,
  timeLimit: state.generalReducer.timeLimit,
  diskUsage: state.generalReducer.diskUsage,
  dataCount: state.generalReducer.dataCount,
  dedup: state.generalReducer.dedup,
});

const mapDispatchToProps = (dispatch) => ({
  getOnDemandJobs: () => dispatch(getOnDemandJobs()),
  getQueueList: (jobSpec) => dispatch(getQueueList(jobSpec)),
  getParamsList: (jobSpec) => dispatch(getParamsList(jobSpec)),
  editDataCount: (query) => dispatch(editDataCount(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FigaroOnDemand);

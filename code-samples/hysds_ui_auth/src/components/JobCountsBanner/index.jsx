import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import "./style.css";

function JobCount(props) {
  let { title, count, className, ...rest } = props;
  const cleanCount = count ? count.toLocaleString() : 0;

  className = className
    ? `${props.className || ""} figaro-job-count`
    : "figaro-job-count";

  return (
    <div className={className} {...rest}>
      {title || "Count"}
      <br />
      <span className="figaro-job-count-value">{cleanCount}</span>
    </div>
  );
}

function JobCountsBanner(props) {
  let history = useHistory();
  const { dataCounts } = props;

  const changeJobState = (status) => {
    props.updateCount();
    history.push({
      search: `?status="${status}"`,
    });
  };

  return (
    <div className="figaro-job-count-banner">
      <JobCount
        className="job-count total"
        title="Total"
        count={dataCounts.total}
      />
      <JobCount
        title="Queued"
        count={dataCounts["job-queued"]}
        className="job-count queued"
        onClick={() => changeJobState("job-queued")}
      />
      <JobCount
        title="Started"
        count={dataCounts["job-started"]}
        className="job-count started"
        onClick={() => changeJobState("job-started")}
      />
      <JobCount
        title="Completed"
        count={dataCounts["job-completed"]}
        className="job-count completed"
        onClick={() => changeJobState("job-completed")}
      />
      <JobCount
        title="Failed"
        count={dataCounts["job-failed"]}
        className="job-count failed"
        onClick={() => changeJobState("job-failed")}
      />
      <JobCount
        title="Revoked"
        count={dataCounts["job-revoked"]}
        className="job-count revoked"
        onClick={() => changeJobState("job-revoked")}
      />
      <JobCount
        title="Deduped"
        count={dataCounts["job-deduped"]}
        className="job-count deduped"
        onClick={() => changeJobState("job-deduped")}
      />
      <JobCount
        title="Offline"
        count={dataCounts["job-offline"]}
        className="job-count offline"
        onClick={() => changeJobState("job-offline")}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  dataCounts: state.generalReducer.jobCounts,
});

export default connect(mapStateToProps)(JobCountsBanner);

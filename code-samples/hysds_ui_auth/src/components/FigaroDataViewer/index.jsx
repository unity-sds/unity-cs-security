import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import ReactTable from "react-table";
import UserTags from "../UserTags";

import { MOZART_BASE_URL, MOZART_REST_API_V1 } from "../../config";

import "./style.css";

const createJobUrl = (jobUrl) => {
  let newJobUrl = jobUrl.replace("http://", `${MOZART_BASE_URL}/verdi/`);
  newJobUrl = newJobUrl.replace(":8085", "");
  return newJobUrl + "/";
};

export const FigaroDataViewer = (props) => {
  const { res } = props;
  const [validJobLink, setJobLink] = useState(false);

  const [viewType, setViewType] = useState("traceback");
  const handleViewTypeChange = (type) => {
    if (type === viewType) setViewType(null);
    else setViewType(type);
  };

  const endpoint = `${MOZART_REST_API_V1}/user-tags`;

  const allowedStatuses = ["job-started", "job-completed", "job-failed"];
  const generatedUserTags =
    res.resource === "job" && allowedStatuses.indexOf(res.status) > -1 ? (
      <UserTags
        tags={res.user_tags || []}
        endpoint={endpoint}
        index={res._index}
        id={res._id}
      />
    ) : null;

  const createTimestamps = (jobInfo) => (
    <div>
      {jobInfo.time_queued ? (
        <span>time queued: {jobInfo.time_queued}</span>
      ) : null}
      {jobInfo.time_start ? <span> | start: {jobInfo.time_start}</span> : null}
      {jobInfo.time_end ? <span> | end: {jobInfo.time_end}</span> : null}
    </div>
  );

  const generateTags = (tags) => {
    const dedupedTags = [...new Set(tags)];
    return dedupedTags.join(", ");
  };

  const renderJobTabInfo = (type) => {
    switch (type) {
      case "products": {
        return (
          <>
            {res.job &&
            res.job.job_info &&
            res.job.job_info.metrics &&
            res.job.job_info.metrics.products_staged ? (
              <>
                {res.job.job_info.metrics.products_staged.map((p) => (
                  <li key={p.id}>
                    <Link to={`/tosca?_id="${p.id}"`}>{p.id}</Link>
                  </li>
                ))}
              </>
            ) : null}
          </>
        );
      }
      case "traceback": {
        return (
          <>
            {res.traceback ? (
              <div className="figaro-code-format">{res.traceback}</div>
            ) : null}
            {res.event && res.event.traceback ? (
              <div className="figaro-code-format">{res.event.traceback}</div>
            ) : null}
          </>
        );
      }
      case "details": {
        return (
          <>
            {res.msg_details ? (
              <div className="figaro-code-format">{res.msg_details}</div>
            ) : null}
          </>
        );
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    if (res.job && res.job.job_info && res.job.job_info.job_url) {
      // setting a timeout and checking if job worker link is still valid
      const controller = new AbortController();
      const signal = controller.signal;
      setTimeout(() => controller.abort(), 350);
      fetch(createJobUrl(res.job.job_info.job_url), { signal }).then((res) => {
        if (res.status === 200) setJobLink(true);
      });
    }
  }, []);

  return (
    <div key={`${res._index}-${res._id}`} className="figaro-data-component">
      {res.tags && res.tags.length > 0 ? (
        <div>tags: {generateTags(res.tags)}</div>
      ) : null}
      <div>status: {res.status}</div>
      {res.resource ? <div>resource: {res.resource}</div> : null}
      <div>index: {res._index}</div>
      <div>
        <a
          className="figaro-data-view-link figaro-id-link"
          onClick={() => props.editCustomFilterId("_id", res._id)}
        >
          ID: {res._id}
        </a>
      </div>
      {res.payload_id ? (
        <div>
          <a
            className="figaro-data-view-link figaro-id-link"
            onClick={() =>
              props.editCustomFilterId("payload_id", res.payload_id)
            }
          >
            payload_id: {res.payload_id}
          </a>
        </div>
      ) : null}
      {res.status === "job-deduped" && res.dedup_job ? (
        <a
          className="figaro-data-view-link figaro-id-link"
          onClick={() => props.editCustomFilterId("_id", res.dedup_job)}
        >
          dedup_job: {res.dedup_job}
        </a>
      ) : null}
      <div>timestamp: {res["@timestamp"]}</div>
      {res.job ? <div>job: {res.job.name}</div> : null}
      {res.job && res.job.job_info && res.job.job_info.execute_node ? (
        <div>node: {res.job.job_info.execute_node}</div>
      ) : null}
      {res.job && res.job.job_info ? (
        <div>queue: {res.job.job_info.job_queue}</div>
      ) : null}
      {res.job && res.job.priority ? (
        <div>priority: {res.job.priority}</div>
      ) : null}
      {res.job && res.job.job_info ? createTimestamps(res.job.job_info) : null}
      {res.job && res.job.retry_count ? (
        <div>retry count: {res.job.retry_count}</div>
      ) : null}
      {res.job && res.job.job_info && res.job.job_info.duration ? (
        <div>duration: {res.job.job_info.duration}s</div>
      ) : null}
      {generatedUserTags}
      <div>
        {res.traceback || (res.event && res.event.traceback) ? (
          <a
            className="figaro-job-info-link"
            onClick={() => handleViewTypeChange("traceback")}
          >
            Traceback
          </a>
        ) : null}
        {res.msg_details ? (
          <a
            className="figaro-job-info-link"
            onClick={() => handleViewTypeChange("details")}
          >
            Job Details
          </a>
        ) : null}
        {res.job &&
        res.job.job_info &&
        res.job.job_info.metrics &&
        res.job.job_info.metrics.products_staged ? (
          <a
            className="figaro-job-info-link"
            onClick={() => handleViewTypeChange("products")}
          >
            {res.status === "job-completed"
              ? "View staged products"
              : "View triaged products"}
          </a>
        ) : null}
        {validJobLink ? (
          <>
            <a href={createJobUrl(res.job.job_info.job_url)} target="_blank">
              View Job
            </a>
          </>
        ) : null}
      </div>
      {renderJobTabInfo(viewType)}
    </div>
  );
};

FigaroDataViewer.propTypes = {
  res: PropTypes.object.isRequired,
};

export function FigaroDataTable(props) {
  const { columns, data, sortColumn, sortOrder } = props;

  return (
    <ReactTable
      manual
      data={data}
      columns={columns}
      showPagination={false}
      showPageSizeOptions={false}
      pageSize={data.length}
      sortable={false}
      defaultSorted={[
        {
          id: sortColumn,
          desc: sortOrder === "desc" ? true : false,
        },
      ]}
    />
  );
}

import React from "react";

import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.css";

export function Border() {
  return <hr className="job-param-border" />;
}

export function SubmitStatusBar(props) {
  const label = props.label || "Please input label";

  const status = props.status === "failed" ? "failed" : "success";
  const visible = props.visible ? "status-visible" : "status-hidden";

  const className = `job-submit-status-bar ${visible} ${status}`;

  return (
    <div className={className} {...props}>
      <div className="job-submit-status-bar-label">{label}</div>
      {props.reason ? (
        <div className="job-submit-status-bar-sublabel">{props.reason}</div>
      ) : null}
    </div>
  );
}

export function HelperLink(props) {
  return (
    <>
      <a href={props.link} target="_blank" className="helper-link">
        <FontAwesomeIcon icon={faInfo} />
      </a>
    </>
  );
}

export function Checkbox(props) {
  return (
    <>
      <input className="miscellaneous-checkbox" type="checkbox" {...props} />
    </>
  );
}

export function LastUpdatedAtBanner({ time }) {
  return time ? (
    <div className="last-updated-banner">
      <span>Last Updated: {time}</span>
    </div>
  ) : null;
}

import React from "react";
import { Link } from "react-router-dom";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.css";

import upArrow from "../../images/arrow-up.png";

export function Button(props) {
  let { label, size, color, loading } = props;

  label = loading ? <FontAwesomeIcon icon={faSpinner} spin={true} /> : label;

  var colorClass;
  switch (color) {
    case "success":
      colorClass = "button-success";
      break;
    case "fail":
      colorClass = "button-fail";
      break;
    case "warning":
      colorClass = "button-warning";
      break;
    default:
      colorClass = "button-basic";
  }

  var sizeClass;
  switch (size) {
    case "small":
      sizeClass = "button-small";
      break;
    case "large":
      sizeClass = "button-large";
      break;
    default:
      sizeClass = "button";
  }

  return (
    <button className={`${sizeClass} ${colorClass}`} {...props}>
      {label || "Button"}
    </button>
  );
}

export function ButtonLink(props) {
  return (
    <Link to={props.href} target={props.target}>
      <Button {...props} />
    </Link>
  );
}

export function ScrollTop(props) {
  return <img src={upArrow} className="scroll-top-button" {...props} />;
}

export function ToggleButton(props) {
  let label = props.enabled ? "On" : "Off";
  label = props.loading ? (
    <FontAwesomeIcon icon={faSpinner} spin={true} />
  ) : (
    label
  );

  const toggleClass = props.enabled ? "on" : "off";
  const className = `rules-table-button ${toggleClass}`;

  return (
    <button className={className} disabled={props.loading} {...props}>
      {label}
    </button>
  );
}

export function DeleteButton(props) {
  let label = props.label || "Delete";
  label = props.loading ? (
    <FontAwesomeIcon icon={faSpinner} spin={true} />
  ) : (
    label
  );
  return (
    <button
      className="rules-table-button delete"
      disabled={props.loading}
      {...props}
    >
      {label}
    </button>
  );
}

export function EditButton(props) {
  let label = props.label || "Edit";
  label = props.loading ? (
    <FontAwesomeIcon icon={faSpinner} spin={true} />
  ) : (
    label
  );
  return (
    <button className="rules-table-button edit" {...props}>
      {label}
    </button>
  );
}

import React from "react";

import "./style.css";

export function ToggleSlider(props) {
  return (
    <div className="table-toggle-wrapper">
      <span className="table-toggle-label">{props.label || "Label: "} </span>
      <label className="switch">
        <input type="checkbox" {...props} />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export function SortOptions(props) {
  return (
    <div className="sort-results-select-wrapper">
      <span>{props.label || "Label: "} </span>
      <select className="sort-column-dropdown" {...props}>
        <option key="sort-column-none" value="None">
          None
        </option>
        {props.options.map((field) => (
          <option key={`sort-column-${field}`} value={field}>
            {field}
          </option>
        ))}
      </select>
    </div>
  );
}

SortOptions.defaultProps = {
  options: [],
};

export function SortDirection(props) {
  return (
    <div className="sort-direction-select-wrapper">
      <select className="sort-order-dropdown" {...props}>
        <option key="sort-direction-desc" value="desc">
          desc
        </option>
        <option key="sort-direction-asc" value="asc">
          asc
        </option>
      </select>
    </div>
  );
}

export function PageSizeOptions(props) {
  return (
    <div className="results-page-select-wrapper">
      <span>{props.label || "Page Size:"} </span>
      <select className="page-size-dropdown" {...props}>
        {props.options.map((x) => (
          <option key={`page-size-dropdown-${x}`} value={x}>
            {x}
          </option>
        ))}
      </select>
    </div>
  );
}

PageSizeOptions.defaultProps = {
  options: [10, 25, 50, 100],
};

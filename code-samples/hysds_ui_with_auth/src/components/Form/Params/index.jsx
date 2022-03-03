import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Select from "react-select";

import "./style.css";

const customSelectStyles = {
  control: (base, value) => ({
    ...base,
    border: value.hasValue ? null : "2px solid red",
  }),
};

function Params(props) {
  const handleJobParamInputChange = (e) => {
    let { name, value } = e.target;
    const payload = { name, value };
    props.editParams(payload);
  };

  const handleJobParamDropdownChange = (e, v) => {
    const payload = {
      name: v.name,
      value: e.value,
    };
    props.editParams(payload);
  };

  const renderParamsList = () => {
    const { params } = props;

    return props.paramsList.map((param) => {
      const paramName = param.name;
      let value = params[paramName];

      try {
        if (value && typeof value === "object") value = JSON.stringify(value);
      } catch (err) {}

      switch (param.type) {
        case "number":
          return (
            <div className="params-input-wrapper" key={paramName}>
              <label className="params-input-label">{paramName}:</label>
              <input
                type="number"
                step="1"
                value={value || ""}
                name={paramName}
                placeholder={param.placeholder}
                onChange={handleJobParamInputChange}
                className="params-input"
                required={param.optional ? false : true}
              />
            </div>
          );
        case "enum":
          return (
            <section className="params-dropdown-wrapper" key={paramName}>
              <label className="params-label">{paramName}:</label>
              <div className="react-select-wrapper">
                <Select
                  label={paramName}
                  value={value ? { label: value, value: value || "" } : null}
                  name={paramName}
                  options={param.enumerables.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  onChange={handleJobParamDropdownChange}
                  styles={param.optional ? null : customSelectStyles}
                />
              </div>
            </section>
          );
        case "boolean": {
          let options = [
            { label: "true", value: true },
            { label: "false", value: false },
          ];
          return (
            <section className="params-dropdown-wrapper" key={paramName}>
              <label className="params-label">{paramName}:</label>
              <div className="react-select-wrapper">
                <Select
                  label={paramName}
                  value={
                    value != undefined
                      ? { label: value.toString(), value: value || "" }
                      : null
                  }
                  name={paramName}
                  options={options}
                  onChange={handleJobParamDropdownChange}
                  styles={param.optional ? null : customSelectStyles}
                />
              </div>
            </section>
          );
        }
        case "region":
        case "object":
        case "textarea": {
          let className = "params-textarea";
          if (!param.optional && !value) className = `${className} required`;

          return (
            <div className="params-textarea-wrapper" key={paramName}>
              <label className="params-textarea-label">{paramName}:</label>
              <textarea
                className={className}
                name={paramName}
                value={value || ""}
                onChange={handleJobParamInputChange}
              />
            </div>
          );
        }
        default:
          return (
            <div className="params-input-wrapper" key={paramName}>
              <div className="params-input-label">{paramName}:</div>
              <input
                type="text"
                value={value || ""}
                name={paramName}
                placeholder={param.placeholder}
                onChange={handleJobParamInputChange}
                className="params-input"
                required={param.optional ? false : true}
              />
            </div>
          );
      }
    });
  };

  const renderedParamsList = renderParamsList();
  return renderedParamsList;
}

Params.propTypes = {
  editParams: PropTypes.func.isRequired,
};

Params.defaultProps = {
  url: false,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { url } = ownProps;
  return {
    editParams: (param) => dispatch(ownProps.editParams(param, url)),
  };
};

export default connect(null, mapDispatchToProps)(Params);

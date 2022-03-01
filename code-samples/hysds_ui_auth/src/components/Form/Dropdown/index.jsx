import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Select from "react-select";

import "./style.css";

function Dropdown(props) {
  const { label, value, options, url, required, ...rest } = props;

  const handleChange = (e) => props.editValue(e.value, url);

  const styles = {
    control: (base, value) => ({
      ...base,
      border: required && !value.hasValue ? "2px solid red" : null,
    }),
  };

  return (
    <section className="dropdown-input-wrapper">
      <label className="dropdown-label">{label}:</label>
      <div className="dropdown-select-wrapper">
        <Select
          options={options}
          value={{
            label: value !== null && value !== undefined ? String(value) : "",
            value: value,
          }}
          onChange={handleChange}
          isDisabled={!(options.length > 0)}
          styles={styles}
          {...rest}
        />
      </div>
    </section>
  );
}

Dropdown.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  options: PropTypes.array.isRequired,
  editValue: PropTypes.func.isRequired,
};

Dropdown.defaultProps = {
  label: "Label",
  required: false,
  url: false,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { editValue, url } = ownProps;
  return {
    editValue: (value) => dispatch(editValue(value, url)),
  };
};

export default connect(null, mapDispatchToProps)(Dropdown);

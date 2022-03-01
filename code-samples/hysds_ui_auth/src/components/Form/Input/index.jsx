import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./style.css";

function Input(props) {
  const { label, value, url, editValue, ...rest } = props;

  const handleChange = (e) => editValue(e.target.value, url);

  return (
    <div className="form-input-wrapper">
      <div className="form-input-label">{label}:</div>
      <input
        onChange={handleChange}
        value={value}
        className="form-input"
        {...rest}
      />
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  editValue: PropTypes.func.isRequired,
};

Input.defaultProps = {
  label: "Label",
  url: false,
  required: false,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { editValue, url } = ownProps;
  return {
    editValue: (value) => dispatch(editValue(value, url)),
  };
};

export default connect(null, mapDispatchToProps)(Input);

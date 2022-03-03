import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Creatable } from "react-select";

function Tags(props) {
  const value = props.value.map((tag) => ({
    value: tag,
    label: tag,
  }));

  const onChange = (e, v) => {
    if (v.action === "create-option") {
      const newRule = e[e.length - 1];
      if (!newRule.value.trim()) return;
    }
    props.changeTag(e);
  };

  return (
    <>
      <section className="job-input-wrapper">
        <label className="job-input-label">Tags:</label>
        <div className="job-input-select-wrapper">
          <Creatable
            isMulti
            onChange={onChange}
            value={value}
            options={props.options}
          />
        </div>
      </section>
    </>
  );
}

Tags.propTypes = {
  value: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  changeTag: PropTypes.func.isRequired,
};

Tags.defaultProps = {
  tags: [],
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { changeTag } = ownProps;
  return {
    changeTag: (tag) => dispatch(changeTag(tag)),
  };
};

export default connect(null, mapDispatchToProps)(Tags);

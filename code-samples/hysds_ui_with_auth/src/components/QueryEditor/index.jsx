import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./style.css";

const QueryEditor = (props) => {
  let { query } = props;
  const [body, setBody] = useState("");
  const [mounted, setMounted] = useState(false);

  if (query && !mounted) {
    try {
      query = JSON.parse(query);
      query = JSON.stringify(query, null, 2);
      setBody(query);
    } catch (err) {
      setBody(query);
    }
    setMounted(true);
  }

  const numRows = body.split("\n").length;

  const handleQueryChange = (e) => {
    setBody(e.target.value);
    props.editQuery(e.target.value);
  };

  return (
    <div className="code-edit-container">
      <textarea
        spellCheck="false"
        className="code-input"
        value={body}
        onChange={handleQueryChange}
        rows={numRows}
      />
    </div>
  );
};

QueryEditor.propTypes = {
  editQuery: PropTypes.func.isRequired,
};

QueryEditor.defaultProps = {
  url: false,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { url, editQuery } = ownProps;
  return {
    editQuery: (query) => dispatch(editQuery(query, url)),
  };
};

export default connect(null, mapDispatchToProps)(QueryEditor);

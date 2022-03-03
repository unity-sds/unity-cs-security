import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

import ReactJson from "react-json-view";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HeaderBar from "../../components/HeaderBar";

import { GRQ_ES_URL } from "../../config";

import "./style.css";

const MetadataViewer = (props) => {
  const { id, index } = props.match.params;
  const classTheme = props.darkMode ? "__theme-dark" : "__theme-light";

  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const endpoint = `${GRQ_ES_URL}/${index}/_doc/${id}`;

  useEffect(() => {
    fetch(endpoint)
      .then((res) => {
        try {
          return res.json();
        } catch (err) {
          throw new Error("Error retrieving metadata from Elasticsearch");
        }
      })
      .then((data) => {
        setLoading(false);
        setMetadata(data);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.error(err);
      });
  }, []);

  const theme = props.darkMode ? "monokai" : "rjv-default";
  const backgroundColor = props.darkMode
    ? "var(--dark-theme-background)"
    : "var(--light-theme-background)";

  let view = null;
  if (error) {
    view = (
      <div class="metadata-view-error">
        <span>Error connecting to Elasticsearch</span>
      </div>
    );
  } else if (loading) {
    view = (
      <div class="metadata-view-loader">
        <span className="metadata-view-buffer">
          <FontAwesomeIcon icon={faSpinner} spin={true} />
        </span>
        <span>Loading...</span>
      </div>
    );
  } else {
    view = (
      <ReactJson
        src={metadata}
        displayDataTypes={false}
        theme={theme}
        style={{ backgroundColor }}
        displayObjectSize={false}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>GRQ - Metadata</title>
      </Helmet>
      <HeaderBar title="GRQ - Metadata" theme={classTheme} />

      <div className={classTheme}>
        <div className="metadata-view-container">{view}</div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  darkMode: state.themeReducer.darkMode,
});

export default connect(mapStateToProps)(MetadataViewer);

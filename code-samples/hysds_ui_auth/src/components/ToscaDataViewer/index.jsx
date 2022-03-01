import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux"; // redux

import { Link } from "react-router-dom";
import ReactJson from "react-json-view";

import { clickQueryRegion } from "../../redux/actions";
import UserTags from "../UserTags";
import { Button } from "../Buttons";

import { GRQ_REST_API_V1 } from "../../config";

import "./style.css";

const ToscaDataViewer = (props) => {
  const { res } = props;
  const [viewData, setViewData] = useState(false);

  const endpoint = `${GRQ_REST_API_V1}/grq/user-tags`;

  let userTags =
    res.metadata && res.metadata.user_tags ? res.metadata.user_tags : [];

  const metadataTheme = props.darkMode ? "monokai" : "rjv-default";
  const backgroundColor = props.darkMode
    ? "var(--dark-theme-alt)"
    : "var(--light-theme-background)";

  let browseUrl = res.urls || res.browse_urls;
  if (browseUrl) browseUrl = browseUrl.find((url) => url.startsWith("http"));

  const clickQueryRegion = () => {
    const bbox = JSON.stringify(res.location.coordinates[0]);
    props.clickQueryRegion(bbox);
  };

  return (
    <div key={`${res._index}-${res._id}`} className="tosca-data-viewer">
      <a
        className="tosca-id-link"
        onClick={() => props.clickDatasetId(res._id)}
      >
        id: {res._id}
      </a>
      {res["@timestamp"] ? (
        <div>ingest timestamp: {res["@timestamp"]}</div>
      ) : null}
      <UserTags
        tags={userTags}
        endpoint={endpoint}
        index={res._index}
        id={res._id}
      />
      {browseUrl ? (
        <a className="tosca-browse-link" href={browseUrl} target="_blank">
          Browse
        </a>
      ) : null}
      <span />
      <a className="tosca-metadata-link" onClick={() => setViewData(!viewData)}>
        Preview Metadata
      </a>
      <Link
        className="tosca-metadata-link"
        to={`/tosca/metadata/${res._index}/${res._id}`}
        target="_none"
      >
        Full Metadata
      </Link>
      {res.location &&
      res.location.coordinates &&
      (res.location.type === "polygon" || res.location.type === "Polygon") ? (
        <Button size="small" label="Query Region" onClick={clickQueryRegion} />
      ) : null}
      {viewData ? (
        <div className="tosca-metadata-preview">
          <ReactJson
            src={res}
            displayDataTypes={false}
            enableClipboard={false}
            theme={metadataTheme}
            style={{ backgroundColor }}
            displayObjectSize={false}
          />
        </div>
      ) : null}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  clickQueryRegion: (bbox) => dispatch(clickQueryRegion(bbox)),
});

ToscaDataViewer.propTypes = {
  res: PropTypes.object.isRequired,
};

export default connect(null, mapDispatchToProps)(ToscaDataViewer);

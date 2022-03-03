import React from "react";
import { Helmet } from "react-helmet";

import "./style.css";

function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
      </Helmet>
      <div className="page-not-found">
        <h1>404 Page Not Found</h1>
      </div>
    </>
  );
}

export default NotFound;

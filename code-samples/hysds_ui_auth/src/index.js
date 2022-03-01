import React from "react";
import ReactDOM from "react-dom";
import Routes from "./pages/Routes/index.jsx";

import { Provider } from "react-redux";
import store from "./redux/store";

const Application = (
  <Provider store={store}>
    <Routes />
  </Provider>
);

ReactDOM.render(Application, document.getElementById("app"));

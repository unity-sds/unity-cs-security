# HySDS UI Authentication with OAuth2 Authorization Code Grant with the PKCE (Proof Key for Code Exchange)

This code sample was created based on the HySDS UI source code available at https://github.com/hysds/hysds_ui .

Few additional features were implemented to enable authentication, to demonstrate this as a reference implementation
to use OAuth2 Authorization Code Grant with the PKCE (Proof Key for Code Exchange) in React.JS based Unity UI applications.

## Background

Previously the OAuth 2.0 Implicit Grant was widely used in many Single Page Applications (SPA) such as React.JS applications.
However, now it is not recommended to  use Implicit Grant with SPA (https://oauth.net/2/grant-types/implicit/).
Public clients such as native apps and JavaScript apps should now use the authorization code flow with the PKCE extension instead.

This code sample implements Auth 2.0 Authorization Code Grant with the PKCE based on following references.
- [RFC7636 - Proof Key for Code Exchange by OAuth Public Clients](https://datatracker.ietf.org/doc/html/rfc7636) - By Internet Engineering Task Force (IETF)
- [Setup an OAuth2 PKCE flow for a React.JS application](https://rmannibucau.metawerx.net/react-oauth2-pkce-flow-setup.html) - By Romain Manni-Bucau
- [react-oauth2-pkce library](https://github.com/gardner/react-oauth2-pkce) - By Gardner Bickford
- [OAuth 2.0: Authorization Code Grant Flow with PKCE for Web Applications By Example](https://codeburst.io/oauth-2-0-authorization-code-grant-flow-with-pkce-for-web-applications-by-example-4dbcc089e805) - By John Tucker
- [Sample code related with the above article](https://github.com/larkintuckerllc/todosrus-fe/tree/cognito) - By John Tucker


## Pre-Requisites

- Node (>=6 & < 13) installed on machine
- npm installed

## Update Config File

Update the following settings to match with your setup.

```js
// config/index.js

// Mozart's Rest API
exports.MOZART_REST_API_BASE = "https://zr28r3w7g7.execute-api.us-east-2.amazonaws.com/dev/mozart_rest_api";

// Cognito configs
exports.REACT_APP_LOGOUT_URL = "http://localhost:8080/logout";
exports.REACT_APP_AUTH_CLIENT_ID = "Add Cognito client ID here";
exports.REACT_APP_AUTH_REDIRECT_URI = "http://localhost:8080";
exports.REACT_APP_AUTH_PROVIDER_URL = "https://unity-cs-sample-user-pool.auth.us-east-2.amazoncognito.com/oauth2";

```

## Building and Running Application Locally

```bash
# install nodejs dependencies
npm install

# builds and compiles to dist/index.js
npm run build

# run application in development mode with hot-reloading
npm start

# run application in "production mode"
npm run prod
```

## Dockerizing React Application

- uses nginx as a webserver to serve application as a static file

```bash
# Building the docker image
docker build . -t hysds_ui:latest

# Running image
docker run -p 8080:80 hysds_ui:latest
```


## Code Changes Made to the Existing HySDS UI

1. Added a new 'src/App.js' file with following contents.

```js
import React from "react";
import Routes from "./pages/Routes/index.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
function App() {
  return (
      <Provider store={store}>
        <Routes/>
      </Provider>
  );
}
export default App;

```

2. Updated the 'src/index.js' file as follows.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import SecuredApp from './SecuredApp';

ReactDOM.render(<SecuredApp />, document.getElementById('app'));

```

3. Implemented a new SecuredApp as follows to wrap the original App. This implementation can be considered as a reference implementation and can be reused to wrap any other React.JS App. The UI elements can be improved further.

```js
/**
 * This SecuredApp.js is a reference implementation to use OAuth2 Authorization Code Grant with PKCE (Proof Key for Code Exchange)
 * in React.JS based Unity UI applications.
 *
 * This code is implemented based on the following references:
 *  - https://datatracker.ietf.org/doc/html/rfc7636
 *  - https://rmannibucau.metawerx.net/react-oauth2-pkce-flow-setup.html
 *  - https://github.com/gardner/react-oauth2-pkce
 *  - https://codeburst.io/oauth-2-0-authorization-code-grant-flow-with-pkce-for-web-applications-by-example-4dbcc089e805
 *  - https://github.com/larkintuckerllc/todosrus-fe/tree/cognito
 */
import React from 'react';
import App from './App';
import {AuthProvider, AuthService, useAuth} from 'react-oauth2-pkce'
import {REACT_APP_AUTH_PROVIDER_URL, REACT_APP_AUTH_CLIENT_ID, REACT_APP_AUTH_REDIRECT_URI} from "./config";
import { Button } from "./components/Buttons";
import jwt_decode from "jwt-decode";

// Variable to store tokens
let tokens;

// Initialize AuthService
const authService = new AuthService({
    clientId: REACT_APP_AUTH_CLIENT_ID,
    provider: REACT_APP_AUTH_PROVIDER_URL,
    redirectUri: REACT_APP_AUTH_REDIRECT_URI,
    scopes: ['openid'],
});

/**
 * Checks if a given access token has a given role.
 *
 * @param accessToken
 * @param role
 * @returns true if the given access token has the given role, else false
 */
function hasRole(accessToken, role) {
    let accessTokenDecoded = jwt_decode(accessToken);
    let cognitoGroups = accessTokenDecoded["cognito:groups"].toString();
    console.log(cognitoGroups);
    let roles = cognitoGroups.split(',').map(function(item) {
        return item.trim();
    });

    return roles.includes(role);
}

function SecuredApp() {
    const { authService } = useAuth();

    const login = async () => authService.authorize();
    const logout = async () => authService.logout();

    if (authService.isPending()) {
        return <div>
            <h3>Loading...</h3>
            <Button size="large" color="fail" label="Reset" onClick={() => { logout(); login(); }} />
        </div>
    }

    if (!authService.isAuthenticated()) {
        return (
            <div>
                <h3>Not Logged-in</h3>
                <Button size="large" color="fail" label="Login with Cognito" onClick={login} />
            </div>
        )
    }

    let accessToken = authService.getAuthTokens().access_token;
    let idToken = authService.getAuthTokens().id_token;
    let refreshToken = authService.getAuthTokens().refresh_token;

    tokens = accessToken === null ? null : {
        accessToken,
        idToken,
        refreshToken,
    };

    // Get logged in user name, email and user groups
    let accessTokenDecoded = jwt_decode(tokens.accessToken);
    let idTokenDecoded = jwt_decode(tokens.idToken);
    let loggedInUserName = accessTokenDecoded.username;
    let loggedInUserEmail = idTokenDecoded.email;
    let logoutLabel = "Logout : " + loggedInUserEmail;
    let userGroups = accessTokenDecoded["cognito:groups"].toString();

    // Check access token for the required roles
    if (!hasRole(accessToken, "Unity_Viewer") && !hasRole(accessToken, "Unity_Admin")) {
        return (
            <div>
                <h3>User {loggedInUserName} ({loggedInUserEmail}) is not authorized to access this application.</h3>
                <h3>Please check your user groups [{userGroups}].</h3>
                <Button size="large" color="fail" label="Logout" onClick={logout} />
            </div>
        );
    }

    return (
        <div align="right">
            <Button size="large" color="fail" label={logoutLabel} onClick={logout} />
            <App />
        </div>
    );
}

// Wraps the SecureApp with AuthProvider
function WrappedSecuredApp() {
    return (
        <AuthProvider authService={authService} >
            <SecuredApp />
        </AuthProvider>
    );
}

/**
 * Returns tokens
 */
export const getTokens = () => tokens;

export default WrappedSecuredApp;

```

4. Updated the `getJobCounts` function at `src/redux/actions/figaro/index.js` to access a [light weight mock endpoint of Mozart REST API](https://github.com/unity-sds/unity-cs-security/tree/main/code-samples/hysds_mozart_mock) with an access token.

```js
import { getTokens } from "../../../SecuredApp";

export const getJobCounts = () => (dispatch) => {
  const jobCountsEndpoint = `${MOZART_REST_API_BASE}/job_count`;

    return fetch(jobCountsEndpoint, {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Bearer ' + getTokens().accessToken
        })
    })
    .then((res) => res.json())
    .then((data) =>
      dispatch({
        type: JOB_COUNTS,
        payload: data.counts,
      })
    );
};

```

## Basic Example with Some U-SPS Components Integrated

More details and screenshots of this example available at https://github.com/unity-sds/unity-cs/wiki/Unity-Security-Guidelines#basic-example-with-some-u-sps-components-integrated
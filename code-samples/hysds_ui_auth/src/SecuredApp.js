/**
 * This SecuredApp.js is a reference implementation to use OAuth2 PKCE (Proof Key for Code Exchange) flow
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

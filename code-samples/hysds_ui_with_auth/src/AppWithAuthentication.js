/**
 * This AppWithAuthentication.js is a reference implementation to use OAuth2 Authorization Code Grant with PKCE (Proof Key for Code Exchange)
 * in React.JS based Unity UI applications.
 *
 * This code is implemented based on the following references:
 *  - https://datatracker.ietf.org/doc/html/rfc7636
 *  - https://rmannibucau.metawerx.net/react-oauth2-pkce-flow-setup.html
 *  - https://github.com/gardner/react-oauth2-pkce
 *  - https://www.npmjs.com/package/react-oauth2-pkce
 *  - https://codeburst.io/oauth-2-0-authorization-code-grant-flow-with-pkce-for-web-applications-by-example-4dbcc089e805
 *  - https://github.com/larkintuckerllc/todosrus-fe/tree/cognito
 */
import React from 'react';
import App from './App';
import {AuthProvider, AuthService, useAuth} from 'react-oauth2-pkce'
import {
    OAUTH2_PROVIDER_URL,
    OAUTH2_CLIENT_ID,
    OAUTH2_REDIRECT_URI,
    APP_VIEWER_GROUP_NAME,
    APP_ADMIN_GROUP_NAME
} from "./config";
import { Button } from "./components/Buttons";
import jwt_decode from "jwt-decode";

// Variable to store tokens
let tokens;

// Initialize AuthService
const authService = new AuthService({
    provider: OAUTH2_PROVIDER_URL,
    clientId: OAUTH2_CLIENT_ID,
    redirectUri: OAUTH2_REDIRECT_URI,
    scopes: ['openid', 'profile'],
});

/**
 * Checks if a given access token has a given userGroup.
 *
 * @param accessToken
 * @param userGroup
 * @returns true if the given access token has the given userGroup, else false
 */
function hasUserGroup(accessToken, userGroup) {
    let accessTokenDecoded = jwt_decode(accessToken);
    let cognitoGroups = accessTokenDecoded["cognito:groups"].toString();
    let roles = cognitoGroups.split(',').map(function(item) {
        return item.trim();
    });

    return roles.includes(userGroup);
}

/**
 * Checks for user authentication, only shows the App, if the user is Authenticated AND belongs to valid user groups.
 */
function AppWithAuthentication() {
    const { authService } = useAuth();
    const login = async () => authService.authorize();

    /**
     * Invokes logout for the the user and clears all tokens
     */
    const logout = async () => {
        tokens = null;
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('idToken');
        window.localStorage.removeItem('refreshToken');
        window.localStorage.removeItem('auth');
        await authService.logout();
    }

    if (authService.isPending()) {
        return <div align="center">
            <h4>Loading...</h4>
            <Button size="large" color="fail" label="Reset" onClick={() => {
                logout().then();
                login().then();
            }} />
        </div>
    }

    // If user is not authenticated, then show the Login button
    if (!authService.isAuthenticated()) {
        return (
            <div align="center">
                <h4>User Not Logged-in</h4>
                <Button size="large" color="fail" label="Login with Cognito" onClick={login} />
            </div>
        )
    }

    // If user is authenticated, then read tokens from the authService
    let accessToken = authService.getAuthTokens().access_token;
    let idToken = authService.getAuthTokens().id_token;
    let refreshToken = authService.getAuthTokens().refresh_token;

    tokens = accessToken === null ? null : {
        accessToken,
        idToken,
        refreshToken
    };

    // Get logged in username, email and user groups
    let accessTokenDecoded = jwt_decode(tokens.accessToken);
    let idTokenDecoded = jwt_decode(tokens.idToken);
    let loggedInUserName = accessTokenDecoded.username;
    let loggedInUserEmail = idTokenDecoded.email;
    let logoutLabel = "Logout : " + loggedInUserEmail;
    let userGroups = accessTokenDecoded["cognito:groups"].toString();

    // Check if the access token has the user groups required to access the App
    if (!hasUserGroup(accessToken, APP_VIEWER_GROUP_NAME)
        && !hasUserGroup(accessToken, APP_ADMIN_GROUP_NAME)) {
        return (
            <div>
                <h3>  User {loggedInUserName} ({loggedInUserEmail}) is not authorized to access this application.</h3>
                <h3>  Please check your user groups [{userGroups}].</h3>
                <Button size="large" color="fail" label="Logout" onClick={logout} />
            </div>
        );
    }

    // Clear token variables variable after use
    accessTokenDecoded = null;
    idTokenDecoded = null;
    accessToken = null;
    idToken = null;
    refreshToken = null;

    return (

        // Return the App
        <div align="right">
            <Button size="large" color="fail" label={logoutLabel} onClick={
                logout} />
            <App />
        </div>
    );
}

/**
 * Returns tokens
 */
export const getTokens = () => tokens;

// AppWithAuthentication wrapped by the AuthProviderWrapper
const AuthProviderWrapper = () => {
    return (
        <AuthProvider authService={authService} >
            <AppWithAuthentication />
        </AuthProvider>
    )
}

export default AuthProviderWrapper;

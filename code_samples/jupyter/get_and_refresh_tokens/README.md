# Python Function to Get and Refresh Cognito Tokens

The source code for the function is available with the function_to_refresh_cognito_tokens.ipynb included 
with this README file.

The get_unity_cognito_access_token() function returns the Cognito access token. If the Cognito 
access token is expired, then this function uses the Cognito refresh token to refresh the environment 
variables: UNITY_COGNITO_ACCESS_TOKEN, UNITY_COGNITO_ID_TOKEN and UNITY_COGNITO_ACCESS_TOKEN_EXPIRY.
After renewing the environment variables, this function returns the new Cognito access token.

The environment variables UNITY_COGNITO_ACCESS_TOKEN_EXPIRY, UNITY_COGNITO_REFRESH_TOKEN, 
UNITY_COGNITO_SECRET_HASH, UNITY_COGNITO_APP_CLIENT_ID and  UNITY_COGNITO_ACCESS_TOKEN should be 
available for this function to work. These environment variables are populated during the JupyterLab spawn.

This function uses the Cognito refresh token and by default the Cognito refresh token will expire after 30 days. 
It was assumed that this JupyterLab will not stay active for more than 30 days. If this assumption is 
no longer valid in the future, it is required to update this function to update the environment 
variable REFRESH_TOKEN_AUTH too using the client_idp.initiate_auth with USER_PASSWORD_AUTH auth flow, after 30 days. 

The following link contains an example where username and password is obtained from a user to execute 
the client_idp.initiate_auth with USER_PASSWORD_AUTH auth flow.
https://github.com/unity-sds/unity-cs-security/blob/main/code_samples/jupyter/identity_pool_aws_creds/Cognito-Identity-Pool-S3-Access.ipynb

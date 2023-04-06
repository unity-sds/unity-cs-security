# Using Cognito Identity Pools to Get Temporary AWS Credentials by Providing a Cognito ID Token

The Jupyter Notebook  available in this directory is a working example to get temporary AWS credentials
by providing a Cognito ID token. This example is based on the approached explained in the
[Accessing AWS services using an identity pool after sign-in](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html) article and 
this shows a way to access an S3 bucket after authenticating a user with a Cognito user pool.

## Cognito Setup

### IAM Role

An IAM role was created with permission to access S3 buckets.

### Cognito User Pool 

A Cognito user pool should be available with,
1) At least one App Client (The client ID of this client will be used in  the Jupyter Notebook)
2) A user group associated with the IAM role created above

### Identity Pool

A Cognito identity pool should be created and associated with the IAM Role created above.


## Jupyter Notebook on Jupyter Lab

The Get-AWS-Creds-From-Cognito-ID-Token.ipynb Jupyter Notebook provides a python function called
get_aws_creds_from_cognito_id_token(cognito_identity_pool_id, cognito_user_pool_id, aws_account_id, region, cognito_id_token).
This function is used to obtain temporary AWS credentials using a Cognito ID token (check the Note below
for more information).

1) Login to JupyterHub to launch a JupyterLab 
2) Upload the Get-AWS-Creds-From-Cognito-ID-Token.ipynb
3) Update the following constants
```
# Obtain the Cognito identity pool ID from the Unity Common Services Team
IDENTITY_POOL_ID = ''

# You AWS Account ID
AWS_ACCOUNT_ID = ''

# Obtain the Cognito user pool ID from the Unity Common Services Team
COGNITO_USER_POOL_ID = ''

# Obtain the Cognito Client ID relevant to your usecase from the Unity Common Services Team
COGNITO_CLIENT_ID = ''

# AWS Region
REGION = 'us-west-2'
```
4) Run -> Run All Cells
5) Enter the Cognito username and password when prompted
6) Observe the list of S3 buckets at the end of the Jupyter Notebook

Note:

In above Get-AWS-Creds-From-Cognito-ID-Token.ipynb Jupyter Notebook,an ID token is obtained using the 
USER_PASSWORD_AUTH auth flow of client_idp.initiate_auth(). This code interactively requests for
username and password to obtain the ID token. This code is only added for demonstration purposes and 
usually the Cognito ID token should be available as the UNITY_COGNITO_ID_TOKEN environment variable, 
which is stored during the JupyterLab spawn or an access token refresh. This UNITY_COGNITO_ID_TOKEN 
environment variable can be updated using the get_unity_cognito_access_token() function defined in 
the ../get_and_refresh_tokens/Refresh-Cognito-Tokens.ipynb

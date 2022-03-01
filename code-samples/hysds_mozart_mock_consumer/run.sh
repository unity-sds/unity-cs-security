#!/bin/sh

export CLIENT_ID=Add_CLIENT_ID_here

export CLIENT_SECRET=Add_CLIENT_SECRET_here

export TOKEN_ENDPOINT=https://unity-cs-sample-user-pool.auth.us-east-2.amazoncognito.com/oauth2/token

export MOZART_MOCK_JOB_COUNT_ENDPOINT=https://zr28r3w7g7.execute-api.us-east-2.amazonaws.com/dev/mozart_rest_api/job_count

export OAUTHLIB_INSECURE_TRANSPORT=1

python3 app.py

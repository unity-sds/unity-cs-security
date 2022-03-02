'''
 This is a reference implementation to use OAuth2.0 Client Credential flow in a Flask application.

 In this example, this application acts as a consumer for the Mock Mozart Job Count API and uses
 Client Credential flow to access the protected Mock Mozart Job Count API.

 This example uses the Requests-OAuthlib and this code is implemented based on the following references:
   - https://requests-oauthlib.readthedocs.io/en/latest/index.html
   - https://requests-oauthlib.readthedocs.io/en/latest/oauth2_workflow.html#web-application-flow
   - https://lobster1234.github.io/2018/05/31/server-to-server-auth-with-amazon-cognito/
'''

from flask import Flask, request
from flasgger import Swagger, LazyString, LazyJSONEncoder
from flasgger import swag_from
from flask_cors import CORS
from flask import jsonify, Blueprint, request, Response
import requests
from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session
from requests.auth import HTTPBasicAuth
import os

app = Flask(__name__)
CORS(app)
app.json_encoder = LazyJSONEncoder

swagger_template = dict(
info = {
    'title': LazyString(lambda: 'Consumer/Client of Mock Mozart Job Count API Swagger UI document'),
    'version': LazyString(lambda: '0.1'),
    'description': LazyString(lambda: 'This is the Swagger UI document to execute the mock Mozart job_count consumer endpoint'),
    },
    host = LazyString(lambda: request.host)
)
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'consume_job_count',
            "route": '/job_count.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/"
}

swagger = Swagger(app, template=swagger_template,
                  config=swagger_config)

@swag_from("job_count.yml", methods=['GET'])
@app.route("/job_count")
def job_count():

    # Read Cognito configurations from environment variables set in run.sh
    client_id = os.getenv('CLIENT_ID')
    client_secret = os.getenv('CLIENT_SECRET')
    token_endpoint = os.getenv('TOKEN_ENDPOINT')
    mozart_mock_job_count_endpoint = os.getenv('MOZART_MOCK_JOB_COUNT_ENDPOINT')

    # Authenticate with OAuth2.0 Client Credentials Flow
    auth = HTTPBasicAuth(client_id, client_secret)
    client = BackendApplicationClient(client_id=client_id)
    oauth = OAuth2Session(client=client)
    token = oauth.fetch_token(token_url=token_endpoint, auth=auth)
    response = oauth.get(url=mozart_mock_job_count_endpoint)
    return response.json()


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=7070)

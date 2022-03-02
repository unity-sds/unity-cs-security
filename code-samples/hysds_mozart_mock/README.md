# Mock API to Represent the Mozart Job Count Endpoint

This is a mock API to represent the Mozart endpoint, which is used to get the Job Count. This is used as a lightweight service
to demonstrate OAuth2.0 flows.

## Pre-Requisites

- Python3 installed on machine
- pip3 installed

## Install Additional Dependencies

```bash
pip3 install flask
pip3 install flasgger
pip3 install flask_cors 
```

## Run Application

```bash
python3 app.py
```

## Access the API Docs

* Open a web browser and access http://localhost:6060/apidocs 
* This will show a Swagger-UI that can be used to call the http://localhost:6060/job_count endpoint

## Call the Job Count Mock Endpoint with Curl

* Open a terminal and execute the following command.
```bash
curl -X GET "http://localhost:6060/job_count" -H  "accept: application/json"
```
* Above command should return the following output.
```json
{"counts":{"total":432},"success":true}
```

## Securing the Endpoint with AWS REST API Gateway

* The above endpoint can be easily secured with the help of an AWS REST API Gateway.

* The following GitHub URL contains YAML files that can be used to deploy an AWS REST API Gateway.
https://github.com/unity-sds/unity-cs-security/tree/main/code-samples/aws-api-gateway-rest 

* Before deploying this mock API on AWS, please make sure to change the port number to port 80 as follows in the `app.py`.
```python
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=80)
```

* After securing this API with the AWS REST API Gateway, calling the Job Count endpoint should return the following message.
```json
{"message":"Unauthorized"}
```

* The following code samples explain ways to access the secured mock API with OAuth2.0 flows.
1. [HySDS UI Authentication with OAuth2 Authorization Code Grant with the PKCE (Proof Key for Code Exchange)](https://github.com/unity-sds/unity-cs-security/tree/main/code-samples/hysds_ui_auth)
2. [Using OAuth2.0 Client Credential flow in a Flask application](https://github.com/unity-sds/unity-cs-security/tree/main/code-samples/hysds_mozart_mock_consumer)

'''
 This is a mock API to represent the Mozart endpoint, which is used to get the Job Count. This is used as a light weight service
 to demonstrate OAuth2.0 flows.
'''

from flask import Flask, request
from flasgger import Swagger, LazyString, LazyJSONEncoder
from flasgger import swag_from
from flask_cors import CORS
from flask import jsonify, Blueprint, request, Response

app = Flask(__name__)
CORS(app)
app.json_encoder = LazyJSONEncoder

swagger_template = dict(
info = {
    'title': LazyString(lambda: 'Mock Mozart Job Count API Swagger UI document'),
    'version': LazyString(lambda: '0.1'),
    'description': LazyString(lambda: 'This is a mock Job Count API Swagger UI document to execute the job_count endpoint'),
    },
    host = LazyString(lambda: request.host)
)
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'job_count',
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
    """Return total number of jobs and counts by status."""

    body = {
        "size": 0,
        "aggs": {
            "result": {
                "terms": {
                    "field": "status"
                }
            }
        }
    }

    counts = {}
    counts['total'] = 432

    return jsonify({
        'success': True,
        'counts': counts
    })

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=6060)

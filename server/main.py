import json
import os
from io import BytesIO

import flask
from dotenv import load_dotenv
from flask import jsonify, send_file
from flask_cors import CORS
from google.cloud import storage

load_dotenv()

bucket_name = os.environ.get("GCLOUD_PROJECT")


def download_as_stream(folder_name, object_name):
    try:
        client = storage.Client()
        bucket = client.bucket(bucket_name)
        prefix = f'{folder_name}/' if folder_name else ''
        blobs = list(bucket.list_blobs(prefix=prefix))
        full_blob = prefix + object_name

        # Check if the object exists
        for blob in blobs:
            if blob.name == full_blob:
                content = blob.download_as_bytes()
                return send_file(BytesIO(content), as_attachment=True, download_name=object_name)

        # Return a 404 if the object is not found
        return "File not found", 404

    except Exception as e:
        return str(e), 500


def download_as_json(object_name):
    try:
        client = storage.Client()
        # Get a reference to the bucket
        bucket = client.bucket(bucket_name)

        # Get the blob (object) you want to download
        blob = bucket.blob(object_name)

        # Check if the blob exists
        if not blob.exists():
            return "File not found", 404

        # Download the content of the blob
        content = blob.download_as_text()

        content_dict = json.loads(content)

        return jsonify(content_dict)

    except Exception as e:
        return str(e), 500


def init_webapp_routes(app):
    www_path = os.path.dirname(os.path.abspath(__file__)) + "/www"

    @app.route('/cfos-visualizer-stanford/Atlas/<id>')
    def download_atlas(id):
        return download_as_stream("Atlas", id)

    @app.route('/cfos-visualizer-stanford/ActivityMap/<id>')
    def activity_map(id):
        return download_as_stream("ActivityMap", id)

    @app.route('/cfos-visualizer-stanford/Experiment/<id>')
    def experiment(id):
        return download_as_stream("Experiment", id)

    @app.route('/cfos-visualizer-stanford/index.json')
    def index():
        return download_as_json("index_95.json")

    @app.errorhandler(404)
    def page_not_found(error):
        # when a 404 is thrown send the "main" index page
        # unless the first segment of the path is in the exception list
        first_segment_path = flask.request.full_path.split('/')[1]
        if first_segment_path in ['api', 'static', 'test']:  # exception list
            return error
        return index()


def main():
    app = app = flask.Flask(__name__)
    CORS(app, support_credentials=True)
    init_webapp_routes(app)
    app.run(host='0.0.0.0', port=8080)


if __name__ == '__main__':
    main()

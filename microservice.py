import os

from flask import Flask, render_template, jsonify, request, json, make_response

#from json2xml import json2xml, readfromurl, readfromstring, readfromjson
app = Flask(__name__)
@app.route("/")
def index():
    return render_template('maps.html')


@app.route("/save/<filename>", methods=['POST'])
def predict(filename):
    details = request.get_json();
    with open(filename, 'w') as json_file:
        json.dump(details, json_file)
    return "Successfully Added!"

@app.route("/fetch/<filename>", methods=['GET','POST'])
def fetch(filename):

    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, filename)
    data = json.load(open(json_url))
    res = make_response(jsonify(data), 200)
    return res

if __name__ == "__main__":
	app.run(port=5000, debug=True)
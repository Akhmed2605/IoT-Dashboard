from __future__ import annotations

import random
from dataclasses import dataclass

from flask import Flask, jsonify

app = Flask(__name__)


@dataclass
class SensorReading:
    temperature: float


@app.after_request
def enable_cors(response):
    """Allow the static HTML file to fetch from the API without CORS issues."""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


@app.route("/data", methods=["GET"])
def data():
    reading = SensorReading(temperature=random.uniform(20.0, 30.0))
    return jsonify({"temperature": reading.temperature})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)


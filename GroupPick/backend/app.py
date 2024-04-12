from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/', methods = ['GET'])
def hello_world():
    # requests.get(http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1)
    return jsonify({"Hello":"Worldzz"})



@app.route('/test', methods = ['POST', 'GET'])
def test_method():
    return jsonify({"Hello":"World test"})


if __name__ == "__main__":
    app.run(host = '192.168.0.155', port=3000, debug=True)
    # running on localhost:3000 (default if you don't specify something like host = '192.168.0.155')
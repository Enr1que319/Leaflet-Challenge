from flask import Flask, render_template, jsonify
import os
import pymongo

# Create a connection to MongoDB
conn = os.environ.get("MONGODB_URI")

# Client for mongo
client = pymongo.MongoClient(conn)

# Database
db = client.videogames
tectonic_mongo = db.tectonic_plates.find({}, {"_id": 0})
tectonic_json = []

for result in tectonic_mongo:
    tectonic_json.append(result)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


@app.route('/')
def home():

    key = os.environ.get("API_KEY")
    return render_template("index.html", data=key)


@ app.route('/api/v1/tectonic_plates')
def games():

    return jsonify(tectonic_json)


if __name__ == "__main__":
    # @TODO: Create your app.run statement here
    app.run(debug=True)

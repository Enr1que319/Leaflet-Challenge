from flask import Flask, render_template
import os

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


@app.route('/')
def home():

    key = os.environ.get("API_KEY")
    return render_template("index.html", data=key)


if __name__ == "__main__":
    # @TODO: Create your app.run statement here
    app.run(debug=True)

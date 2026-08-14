from flask import Flask
from flask_cors import CORS

from routes.dashboards import dashboards_bp
from routes.data_sources import data_sources_bp

app = Flask(__name__)

CORS(app)

#routes
app.register_blueprint(dashboards_bp)
app.register_blueprint(data_sources_bp)

@app.route("/")
def home():
    return {"message": "Dashbboard registry API running"}

if __name__ == "__main__":
    app.run(debug=True)
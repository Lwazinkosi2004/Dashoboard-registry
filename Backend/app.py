from flask import Flask, jsonify, request
from flask_cors import CORS

if __package__:
    from .db import db
else:
    from db import db

app = Flask(__name__)
CORS(app)


@app.before_request
def reconnect_database():
    if request.path.startswith("/api/"):
        db.ping(reconnect=True)


@app.route("/")
def home():
    return {"message": "Dashboard registry API running"}


@app.route("/api/dashboards", methods=["GET"])
def get_dashboards():
    search = request.args.get("search", "")
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM dashboards WHERE name LIKE %s",
            (f"%{search}%",),
        )
        return jsonify(cursor.fetchall())


@app.route("/api/dashboards", methods=["POST"])
def create_dashboard():
    data = request.get_json(silent=True)
    required_fields = ("name", "description", "url", "category", "owner_name", "status")
    if not isinstance(data, dict) or any(field not in data for field in required_fields):
        return jsonify({"error": "Dashboard details are required"}), 400

    source_ids = data.get("data_source_ids", [])
    if not isinstance(source_ids, list) or any(type(source_id) is not int for source_id in source_ids):
        return jsonify({"error": "data_source_ids must be a list of integers"}), 400

    committed = False
    try:
        with db.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO dashboards
                    (name, description, url, category, owner_name, status)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                tuple(data[field] for field in required_fields),
            )
            dashboard_id = cursor.lastrowid
            for source_id in source_ids:
                cursor.execute(
                    """
                    INSERT INTO dashboard_data_sources
                        (dashboard_id, data_source_id)
                    VALUES (%s, %s)
                    """,
                    (dashboard_id, source_id),
                )
        db.commit()
        committed = True
    finally:
        if not committed:
            db.rollback()

    return jsonify({"message": "Dashboard created"})


@app.route("/api/dashboards/<int:dashboard_id>", methods=["DELETE"])
def delete_dashboard(dashboard_id):
    with db.cursor() as cursor:
        cursor.execute("DELETE FROM dashboards WHERE id = %s", (dashboard_id,))
    db.commit()
    return jsonify({"message": "Dashboard deleted"})


@app.route("/api/dashboards/<int:dashboard_id>", methods=["PUT"])
def update_dashboard(dashboard_id):
    data = request.get_json(silent=True)
    fields = ("name", "description", "url", "category", "owner_name", "status")
    if not isinstance(data, dict) or any(field not in data for field in fields):
        return jsonify({"error": "Dashboard details are required"}), 400

    with db.cursor() as cursor:
        cursor.execute(
            """
            UPDATE dashboards
            SET name = %s, description = %s, url = %s, category = %s,
                owner_name = %s, status = %s
            WHERE id = %s
            """,
            tuple(data[field] for field in fields) + (dashboard_id,),
        )
    db.commit()
    return jsonify({"message": "Dashboard updated"})


@app.route("/api/data_sources", methods=["GET"])
def get_data_sources():
    with db.cursor() as cursor:
        cursor.execute("SELECT * FROM data_sources")
        return jsonify(cursor.fetchall())


@app.route("/api/data_sources", methods=["POST"])
def create_data_source():
    data = request.get_json(silent=True)
    fields = ("name", "type", "description")
    if not isinstance(data, dict) or any(field not in data for field in fields):
        return jsonify({"error": "Data source details are required"}), 400
    if data["type"] not in ("Database", "File", "API"):
        return jsonify({"error": "type must be Database, File, or API"}), 400

    with db.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO data_sources (name, type, description)
            VALUES (%s, %s, %s)
            """,
            tuple(data[field] for field in fields),
        )
    db.commit()
    return jsonify({"message": "Data source created"})


@app.route("/api/data_sources/<int:source_id>", methods=["DELETE"])
def delete_data_source(source_id):
    with db.cursor() as cursor:
        cursor.execute("DELETE FROM data_sources WHERE id = %s", (source_id,))
    db.commit()
    return jsonify({"message": "Data source deleted"})


@app.route("/api/data_sources/<int:source_id>", methods=["PUT"])
def update_data_source(source_id):
    data = request.get_json(silent=True)
    fields = ("name", "type", "description")
    if not isinstance(data, dict) or any(field not in data for field in fields):
        return jsonify({"error": "Data source details are required"}), 400
    if data["type"] not in ("Database", "File", "API"):
        return jsonify({"error": "type must be Database, File, or API"}), 400

    with db.cursor() as cursor:
        cursor.execute(
            """
            UPDATE data_sources
            SET name = %s, type = %s, description = %s
            WHERE id = %s
            """,
            tuple(data[field] for field in fields) + (source_id,),
        )
    db.commit()
    return jsonify({"message": "Data source updated"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)

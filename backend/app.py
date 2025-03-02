# imports
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

# local imports
from db import init_db, create_tables

# create the Flask app
app = Flask(__name__)
# enable CORS
CORS(app)


# routes
# get all tasks
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    with init_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks ORDER BY date_added DESC")
        response = cursor.fetchall()

        columns = [column[0] for column in cursor.description]
        tasks = []
        for task in response:
            task = dict(zip(columns, task))
            tasks.append(task)
        return jsonify(tasks)


# get task by id
@app.route("/api/tasks/<task_id>", methods=["GET"])
def get_task(task_id: str):
    with init_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE id=?", (task_id,))
        task = cursor.fetchone()

        if task:
            return jsonify(task)
        return jsonify({"error": "Task not found"}), 404


# add task
@app.route("/api/tasks", methods=["POST"])
def add_tasks():
    if not request.json or not "title" in request.json:
        return jsonify({"error": "Invalid request"}), 400

    task = {
        "id": str(uuid.uuid4()),
        "title": request.json["title"],
        "category": request.json.get("category", "Other"),
        "date_added": request.json.get("date_added", datetime.now().isoformat()),
        "start_time": request.json.get("start_time", None),
        "end_time": request.json.get("end_time", None),
        "completed": request.json.get("completed", False),
    }

    with init_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO tasks (id, title, category, date_added, start_time, end_time, completed)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                task["id"],
                task["title"],
                task["category"],
                task["date_added"],
                task["start_time"],
                task["end_time"],
                task["completed"],
            ),
        )

        # commit the insert query
        conn.commit()

    return jsonify(task), 201


# update task
@app.route("/api/tasks/<task_id>", methods=["PUT"])
def update_task(task_id: str):
    if not request.json:
        return jsonify({"error": "Invalid request"}), 400

    with init_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE id=?", (task_id,))
        task = cursor.fetchone()

        if not task:
            return jsonify({"error": "Task not found"}), 404

        # Update task fields
        update_task = {
            "title": request.json.get("title", task[0]),
            "category": request.json.get("category", task[1]),
            "start_time": request.json.get("start_time", task[2]),
            "end_time": request.json.get("end_time", task[3]),
            "completed": request.json.get("completed", task[4]),
        }

        cursor.execute(
            """
            UPDATE tasks
            SET title = ?, category = ?, start_time = ?, end_time = ?, completed = ? 
            WHERE id = ?
            """,
            (
                update_task["title"],
                update_task["category"],
                update_task["start_time"],
                update_task["end_time"],
                update_task["completed"],
                task_id,
            ),
        )

        # Insert log entry into task_log
        cursor.execute(
            """
            INSERT INTO task_log (id, task_id, title, category, start_time, end_time, completed, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(uuid.uuid4()),
                task_id,
                update_task["title"],
                update_task["category"],
                update_task["start_time"],
                update_task["end_time"],
                update_task["completed"],
                datetime.now().isoformat(),
            ),
        )

        conn.commit()

        return jsonify(update_task)


# delete task
@app.route("/api/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id: str):
    with init_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM tasks WHERE id=?", (task_id,))
        task = cursor.fetchone()

        if not task:
            return jsonify({"error": "Task not found"}), 404

        # Insert log entry into task_log before deleting the task
        cursor.execute(
            """
            INSERT INTO task_log (id, task_id, title, category, start_time, end_time, completed, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(uuid.uuid4()),
                task_id,
                task[1],  # title
                task[2],  # category
                task[3],  # start_time
                task[4],  # end_time
                -1,  # completed set to -1 to indicate deletion
                datetime.now().isoformat(),
            ),
        )

        cursor.execute("DELETE FROM tasks WHERE id=?", (task_id,))
        conn.commit()

        return jsonify({"message": "Task deleted"})


# get task by category
@app.route("/api/tasks/category/<category>", methods=["GET"])
def get_task_by_category(category: str):
    with init_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM tasks WHERE category=? ORDER BY date_added DESC", (category,)
        )
        tasks = cursor.fetchall()
        return jsonify(tasks)


if __name__ == "__main__":
    # create the tables
    create_tables()
    app.run(debug=True)

import React from "react";
import {
    formatDate,
    formatTime,
    formatDuration,
} from "../utils/dateTimeFormat";

const TasksContainer = ({ tasks, fetchTasks, setError }) => {
    const toggleTaskCompletion = async (id) => {
        const task = tasks.find((task) => task.id === id);
        const updatedTask = {
            ...task,
            completed: !task.completed,
        };

        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedTask),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update task");
            }
            fetchTasks();
        } catch (error) {
            setError(error.message);
        }
    };

    const startTask = async (id) => {
        const task = tasks.find((task) => task.id === id);
        const start_time = new Date().toISOString();
        const updatedTask = {
            ...task,
            start_time,
            end_time: null,
        };

        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedTask),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update task");
            }
            fetchTasks();
        } catch (error) {
            setError(error.message);
        }
    };

    const endTask = async (id) => {
        const task = tasks.find((task) => task.id === id);
        const end_time = new Date().toISOString();
        const updatedTask = {
            ...task,
            end_time,
        };

        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedTask),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update task");
            }
            fetchTasks();
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }
            fetchTasks();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="tasks-container">
            {tasks.length === 0 ? (
                <p>No tasks yet. Add one above!</p>
            ) : (
                tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`task-item ${
                            task.completed ? "completed" : ""
                        }`}
                    >
                        <div className="task-header">
                            <h3>{task.title}</h3>
                            <span className="category-badge">
                                {task.category}
                            </span>
                        </div>

                        <div className="task-details">
                            <p>Added: {formatDate(task.date_added)}</p>
                            <div className="time-container">
                                {task.start_time && (
                                    <div className="time-item">
                                        <p>
                                            Start Time:{" "}
                                            <span>
                                                {formatTime(task.start_time)}
                                            </span>
                                        </p>
                                    </div>
                                )}
                                {task.end_time && (
                                    <React.Fragment>
                                        <span>|</span>
                                        <div className="time-item">
                                            <p>
                                                End Time:{" "}
                                                <span>
                                                    {formatTime(task.end_time)}
                                                </span>
                                            </p>
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                            {task.start_time && task.end_time && (
                                <p>
                                    Duration:{" "}
                                    {formatDuration(
                                        task.start_time,
                                        task.end_time
                                    )}
                                </p>
                            )}
                        </div>

                        <div className="task-actions">
                            {(task.start_time && task.end_time) ||
                            !task.start_time ? (
                                <button
                                    onClick={() => startTask(task.id)}
                                    className="start-button"
                                >
                                    Start
                                </button>
                            ) : (
                                <button
                                    onClick={() => endTask(task.id)}
                                    className="end-button"
                                >
                                    End
                                </button>
                            )}

                            <button
                                onClick={() => toggleTaskCompletion(task.id)}
                                className={
                                    task.completed
                                        ? "uncomplete-button"
                                        : "complete-button"
                                }
                            >
                                {task.completed ? "Uncomplete" : "Complete"}
                            </button>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="delete-button"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TasksContainer;

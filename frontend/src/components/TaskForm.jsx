import React from "react";

const CATEGORIES = ["Reading", "Development", "Exercise", "Study", "Other"];

const TaskForm = ({ fetchTasks, setError }) => {
    const [newTask, setNewTask] = React.useState("");
    const [category, setCategory] = React.useState("Reading");

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) {
            return;
        }

        const taskToAdd = {
            title: newTask,
            category: category,
            date_added: new Date().toISOString(),
            start_time: null,
            end_time: null,
            completed: false,
        };

        try {
            const response = await fetch("http://localhost:5000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskToAdd),
            });

            if (!response.ok) {
                throw new Error("Failed to add task");
            }

            setNewTask("");
            fetchTasks();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form className="task-form" onSubmit={addTask}>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a new task"
                className="task-input"
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
            >
                {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            <button type="submit" className="add-button">
                Add Task
            </button>
        </form>
    );
};

export default TaskForm;

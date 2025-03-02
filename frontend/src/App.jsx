import React from "react";
import "./App.css";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TasksContainer from "./components/TaskContainer";

function App() {
    const [tasks, setTasks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/api/tasks");
            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const tasks = await response.json();
            setTasks(tasks);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="App">
            <Header />

            <div className="container">
                {error && <div className="error">{error}</div>}

                <TaskForm
                    fetchTasks={fetchTasks}
                    setError={setError}
                />

                {loading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <TasksContainer
                        tasks={tasks}
                        fetchTasks={fetchTasks}
                        setError={setError}
                    />
                )}
            </div>
        </div>
    );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load tasks when the application starts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, []);

  const addTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleTask = async (task) => {
    try {
      await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });

      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="app">
      <section className="container">
        <header className="hero">
          <p className="eyebrow">DEVOPS PROJECT</p>
          <h1>Task Manager</h1>
          <p className="subtitle">
            Manage your tasks with React, Node.js, PostgreSQL & AWS.
          </p>
        </header>

        <section className="stats">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>

          <div className="stat-card">
            <span>Remaining</span>
            <strong>{tasks.length - completedCount}</strong>
          </div>
        </section>

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <button type="submit">Add Task</button>
        </form>

        <section className="task-list">
          {loading ? (
            <div className="empty-state">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h2>No tasks yet</h2>
              <p>Add your first task above.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <article
                className={`task ${task.completed ? "completed" : ""}`}
                key={task.id}
              >
                <button
                  className="checkbox"
                  type="button"
                  onClick={() => toggleTask(task)}
                  aria-label={
                    task.completed
                      ? "Mark task incomplete"
                      : "Mark task complete"
                  }
                >
                  {task.completed ? "✓" : ""}
                </button>

                <span className="task-title">{task.title}</span>

                <button
                  className="delete"
                  type="button"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </article>
            ))
          )}
        </section>

        <footer>
          <span>Running on AWS</span>
          <span>•</span>
          <span>Powered by Docker</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
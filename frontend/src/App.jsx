import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, []);

  const addTask = async (event) => {
    event.preventDefault();

    if (!title.trim() || adding) return;

    setAdding(true);

    try {
      await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      setTitle("");
      await fetchTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setAdding(false);
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
  const remainingCount = tasks.length - completedCount;
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return (
    <main className="app">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <section className="container">
        <header className="hero">
          <div className="logo">
            <span className="logo-icon">✓</span>
            <span>TaskFlow</span>
          </div>

          <div className="status">
            <span className="status-dot" />
            All systems operational
          </div>

          <p className="eyebrow">YOUR PRODUCTIVITY SPACE</p>

          <h1>
            Get things done.
            <br />
            <span>One task at a time.</span>
          </h1>

          <p className="subtitle">
            A simple, powerful task manager built with React, Node.js,
            PostgreSQL and AWS.
          </p>
        </header>

        <section className="dashboard">
          <div className="stats">
            <div className="stat-card">
              <div className="stat-icon">◎</div>
              <div>
                <span>Total tasks</span>
                <strong>{tasks.length}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon success">✓</div>
              <div>
                <span>Completed</span>
                <strong>{completedCount}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">◷</div>
              <div>
                <span>Remaining</span>
                <strong>{remainingCount}</strong>
              </div>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-header">
              <div>
                <span>Today's progress</span>
                <strong>{progress}% complete</strong>
              </div>
              <span>{completedCount}/{tasks.length || 0}</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form className="task-form" onSubmit={addTask}>
            <div className="input-wrapper">
              <span className="input-icon">+</span>

              <input
                type="text"
                placeholder="What would you like to accomplish?"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <button
              className="add-button"
              type="submit"
              disabled={adding || !title.trim()}
            >
              {adding ? "Adding..." : "Add task"}
              {!adding && <span>→</span>}
            </button>
          </form>

          <section className="tasks-section">
            <div className="section-heading">
              <div>
                <span className="section-label">YOUR TASKS</span>
                <h2>Today's tasks</h2>
              </div>

              {tasks.length > 0 && (
                <span className="task-count">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                </span>
              )}
            </div>

            {loading ? (
              <div className="loading-list">
                <div className="skeleton" />
                <div className="skeleton" />
                <div className="skeleton" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-circle">✓</div>
                <h3>Your workspace is clear</h3>
                <p>
                  Add a task above and start making progress.
                </p>
              </div>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
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
                      {task.completed && <span>✓</span>}
                    </button>

                    <div className="task-content">
                      <span className="task-title">{task.title}</span>
                      <span className="task-meta">
                        Task #{task.id}
                      </span>
                    </div>

                    <button
                      className="delete"
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      aria-label="Delete task"
                    >
                      <span>×</span>
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>

        <footer>
          <span>TaskFlow</span>
          <span className="footer-dot">•</span>
          <span>Built with React + Node.js + PostgreSQL</span>
          <span className="footer-dot">•</span>
          <span>Deployed on AWS</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
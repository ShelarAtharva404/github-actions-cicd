import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

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
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

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
      const response = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      await fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <main className="app">
      <div className="ambient ambient-purple" />
      <div className="ambient ambient-blue" />
      <div className="ambient ambient-cyan" />

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <span>✓</span>
          </div>

          <div>
            <strong>TaskFlow</strong>
            <span>Get things done.</span>
          </div>
        </div>

        <nav className="navigation">
          <button className="nav-item active" type="button">
            <span>⌂</span>
            Home
          </button>

          <button className="nav-item" type="button">
            <span>☷</span>
            All Tasks
          </button>

          <button className="nav-item" type="button">
            <span>✓</span>
            Completed
          </button>

          <button className="nav-item" type="button">
            <span>▥</span>
            Analytics
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="aws-card">
            <div className="aws-icon">☁</div>
            <strong>Powered by AWS</strong>
            <span>React · Node.js · PostgreSQL</span>

            <div className="connection">
              <span />
              All systems operational
            </div>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="search-box">
            <span>⌕</span>
            <input placeholder="Search tasks..." />
          </div>

          <div className="topbar-right">
            <button className="icon-button" type="button">
              ◐
            </button>

            <div className="profile">
              <div className="avatar">T</div>
              <div>
                <span>Good afternoon</span>
                <strong>TaskFlow User</strong>
              </div>
            </div>
          </div>
        </header>

        <div className="content">
          <section className="welcome">
            <div>
              <p className="greeting">Good afternoon 👋</p>

              <h1>
                Let&apos;s get some things{" "}
                <span className="gradient-text">done.</span>
              </h1>

              <p className="welcome-text">
                Small steps make big progress. Add a task and keep moving
                forward.
              </p>
            </div>

            <div className="date-card">
              <span>PRODUCTIVITY</span>
              <strong>{progress}%</strong>
              <small>completed</small>
            </div>
          </section>

          <form className="create-task" onSubmit={addTask}>
            <div className="create-icon">+</div>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs to be done?"
              aria-label="New task"
            />

            <button type="submit" disabled={adding || !title.trim()}>
              {adding ? "Adding..." : "Add Task"}
              {!adding && <span>→</span>}
            </button>
          </form>

          <section className="stats-grid">
            <article className="stat-card purple">
              <div className="stat-top">
                <span>Total Tasks</span>
                <div className="stat-icon">☷</div>
              </div>

              <strong>{totalTasks}</strong>
              <small>Everything on your list</small>
            </article>

            <article className="stat-card green">
              <div className="stat-top">
                <span>Completed</span>
                <div className="stat-icon">✓</div>
              </div>

              <strong>{completedTasks}</strong>
              <small>
                {completedTasks === 0 ? "Keep going!" : "Great progress!"}
              </small>
            </article>

            <article className="stat-card blue">
              <div className="stat-top">
                <span>Progress</span>
                <div className="stat-icon">◔</div>
              </div>

              <div className="progress-stat">
                <strong>{progress}%</strong>
                <div className="mini-progress">
                  <div style={{ width: `${progress}%` }} />
                </div>
              </div>

              <small>
                {completedTasks} of {totalTasks} completed
              </small>
            </article>
          </section>

          <section className="tasks-area">
            <div className="tasks-header">
              <div>
                <span className="section-label">YOUR WORKSPACE</span>
                <h2>Today&apos;s tasks</h2>
              </div>

              <span className="task-total">
                {remainingTasks} remaining
              </span>
            </div>

            <div className="task-toolbar">
              <div className="filters">
                <button
                  className={filter === "all" ? "filter active" : "filter"}
                  type="button"
                  onClick={() => setFilter("all")}
                >
                  All ({totalTasks})
                </button>

                <button
                  className={filter === "active" ? "filter active" : "filter"}
                  type="button"
                  onClick={() => setFilter("active")}
                >
                  Active ({remainingTasks})
                </button>

                <button
                  className={
                    filter === "completed" ? "filter active" : "filter"
                  }
                  type="button"
                  onClick={() => setFilter("completed")}
                >
                  Completed ({completedTasks})
                </button>
              </div>

              <span className="sort-label">Newest first ↓</span>
            </div>

            {loading ? (
              <div className="task-list">
                <div className="task-skeleton" />
                <div className="task-skeleton" />
                <div className="task-skeleton" />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <h3>
                  {filter === "completed"
                    ? "Nothing completed yet"
                    : "Your workspace is clear"}
                </h3>
                <p>
                  {filter === "completed"
                    ? "Complete a task and it will appear here."
                    : "Add a task above and start making progress."}
                </p>
              </div>
            ) : (
              <div className="task-list">
                {filteredTasks.map((task, index) => (
                  <article
                    className={`task-card ${
                      task.completed ? "completed" : ""
                    }`}
                    key={task.id}
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <button
                      className="task-check"
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

                    <div className="task-info">
                      <strong>{task.title}</strong>

                      <div className="task-details">
                        <span>#{task.id}</span>
                        <span>•</span>
                        <span>
                          {task.completed ? "Completed" : "Created today"}
                        </span>
                      </div>
                    </div>

                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      aria-label="Delete task"
                    >
                      ×
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="footer">
            <span>TaskFlow</span>
            <span>•</span>
            <span>Built with React + Node.js + PostgreSQL</span>
            <span>•</span>
            <span>Deployed on AWS</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

export default App;
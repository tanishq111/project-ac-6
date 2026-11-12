import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTasks } from "./TaskContext.jsx";
import { TaskForm } from "./TaskForm.jsx";

function TaskItem({ task, onToggleTask, onDeleteTask }) {
  return (
    <li className="task-row">
      <input
        type="checkbox"
        checked={task.completed}
        aria-label={`Completed: ${task.title}`}
        onChange={() => onToggleTask(task.id)}
      />
      <Link className={task.completed ? "completed" : ""} to={`/tasks/${task.id}`}>
        {task.title}
      </Link>
      <button
        type="button"
        className="secondary"
        aria-label={`Delete ${task.title}`}
        onClick={() => onDeleteTask(task.id)}
      >
        Delete
      </button>
    </li>
  );
}

export default function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask, storageError } = useTasks();
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedStatus = searchParams.get("status") ?? "all";
  const status = ["all", "open", "done"].includes(requestedStatus) ? requestedStatus : "all";

  const visibleTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = status === "all" ||
      (status === "done" ? task.completed : !task.completed);
    return matchesSearch && matchesStatus;
  });
  const remaining = tasks.filter((task) => !task.completed).length;

  function changeStatus(nextStatus) {
    const nextParams = new URLSearchParams(searchParams);
    if (nextStatus === "all") nextParams.delete("status");
    else nextParams.set("status", nextStatus);
    setSearchParams(nextParams, { replace: true });
  }
  const clearCompleted = () => {
    tasks.filter(task => task.completed).forEach(task => deleteTask(task.id));
  };

  return (
    <>
      <h1 tabIndex={-1}>Tasks</h1>
      <p role="status">{remaining} of {tasks.length} tasks remaining.</p>
      {storageError && <p className="error" role="alert">{storageError}</p>}
      <TaskForm onAddTask={addTask} />
      <div className="filters">
        <div className="field">
          <label htmlFor="search">Search tasks</label>
          <input id="search" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(event) => changeStatus(event.target.value)}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      {visibleTasks.length === 0 ? <p>No matching tasks.</p> : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
          ))}
        </ul>
      )}
       <button type="button" onClick={clearCompleted}>
          Clear Completed
        </button>
    </>
  );
}
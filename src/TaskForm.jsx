import { useState } from "react";
import { createTask } from "./api/taskApi";

export const TaskForm =   ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 3) {
      setError("Enter at least three characters.");
      return;
    }

    onAddTask(trimmedTitle);
    try{
      await createTask({ title: trimmedTitle });
    } catch (error) {
      setError("Failed to create task.");
      return;
    }
    setTitle("");
    setError("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="task-title">Task title</label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "title-error" : undefined}
        />
      </div>
      <button type="submit">Add task</button>
      {error && <p className="error" id="title-error" role="alert">{error}</p>}
    </form>
  );
}
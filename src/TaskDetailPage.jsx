import { Link, useParams } from "react-router-dom";
import { useTasks } from "./TaskContext.jsx";

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const { tasks, toggleTask } = useTasks();
  const task = tasks.find((currentTask) => currentTask.id === taskId);

  if (!task) {
    return (
      <>
        <h1 tabIndex={-1}>Task not found</h1>
        <Link to="/">Back to tasks</Link>
      </>
    );
  }

  return (
    <>
      <h1 tabIndex={-1}>{task.title}</h1>
      <p>Status: {task.completed ? "Done" : "Open"}</p>
      <label className="detail-status">
        <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
        Completed
      </label>
      <p><Link to="/">Back to tasks</Link></p>
    </>
  );
}
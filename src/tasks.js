export const initialTasks = [
  { id: "task-1", title: "Read JSX", completed: false },
  { id: "task-2", title: "Build a component", completed: true },
];

export function tasksReducer(tasks, action) {
  switch (action.type) {
    case "task/added":
      return [...tasks, action.task];
    case "task/toggled":
      return tasks.map((task) => (
        task.id === action.taskId
          ? { ...task, completed: !task.completed }
          : task
      ));
    case "task/deleted":
      return tasks.filter((task) => task.id !== action.taskId);
    default:
      throw new Error(`Unknown task action: ${action.type}`);
  }
}
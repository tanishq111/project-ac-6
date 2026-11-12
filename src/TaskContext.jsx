import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { initialTasks, tasksReducer } from "./tasks.js";
import { getAllTasks } from "./api/taskApi";
const TaskContext = createContext(null);
const storageKey = "react-class-tasks-v1";

function isTask(task) {
  return task !== null && typeof task === "object" &&
    typeof task.id === "string" && task.id.length > 0 &&
    typeof task.title === "string" && task.title.trim().length >= 3 &&
    typeof task.completed === "boolean";
}

function loadTasks() {
  try {
    const rawTasks = localStorage.getItem(storageKey);
    if (rawTasks === null) return initialTasks;

    const parsedTasks = JSON.parse(rawTasks);
    if (!Array.isArray(parsedTasks) || !parsedTasks.every(isTask)) {
      return initialTasks;
    }

    const ids = parsedTasks.map((task) => task.id);
    return new Set(ids).size === ids.length ? parsedTasks : initialTasks;
  } catch {
    return initialTasks;
  }
}

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, undefined, loadTasks);
  const [storageError, setStorageError] = useState("");
  const [task, setTask] = useState(null);


  const fetchTasks = async () => {
    try {
      const response = await getAllTasks();
      const fetchedTasks = response.data;
      if (Array.isArray(fetchedTasks) && fetchedTasks.every(isTask)) {
        dispatch({ type: "tasks/loaded", tasks: fetchedTasks });
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      setStorageError("");
    } catch {
      setStorageError("Tasks work in this tab, but could not be saved on this device.");
    }
  }, [tasks]);
  
  useEffect(() => {
    fetchTasks();
  }, []);

  function addTask(title) {
    dispatch({
      type: "task/added",
      task: { id: crypto.randomUUID(), title, completed: false },
    });
  }

  function toggleTask(taskId) {
    dispatch({ type: "task/toggled", taskId });
  }

  function deleteTask(taskId) {
    dispatch({ type: "task/deleted", taskId });
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, storageError }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === null) {
    throw new Error("useTasks must be used inside TaskProvider.");
  }
  return context;
}
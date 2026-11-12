import { randomUUID } from "node:crypto";
import Task from "../model/Task.js";

const getAllTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json({ data: tasks, count: tasks.length });
};

const getTaskById = async  (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ error: "Task not found." });
  res.json({ data: task });
};

const createTask = async (req, res) => {
    console.log("Creating a new task with title:TTTTTTTTTTTTTTTTTTTT", req.body?.title);
  const title = req.body?.title;
  if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 120) {
    return res.status(400).json({ error: "Title must contain 3 to 120 characters." });
  }

  const task = new Task({ title: title.trim(), completed: false });
  await task.save();
  res.status(201).location(`/api/tasks/${task.id}`).json({ data: task });
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ error: "Task not found." });
  await Task.deleteOne({ _id: req.params.taskId });
  res.status(204).send();
};

const updateTask = async (req, res) => {  
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ error: "Task not found." });

  const body = req.body;
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Send a JSON object." });
  }

  const hasTitle = Object.hasOwn(body, "title");
  const hasCompleted = Object.hasOwn(body, "completed");
  if (!hasTitle && !hasCompleted) {
    return res.status(400).json({ error: "Provide title or completed." });
  }

  if (hasTitle && (typeof body.title !== "string" ||
    body.title.trim().length < 3 || body.title.trim().length > 120)) {
    return res.status(400).json({ error: "Title must contain 3 to 120 characters." });
  }

  if (hasCompleted && typeof body.completed !== "boolean") {
    return res.status(400).json({ error: "Completed must be a boolean." });
  }

  const changes = {};
  if (hasTitle) changes.title = body.title.trim();
  if (hasCompleted) changes.completed = body.completed;

  const updatedTask = { ...task, ...changes };
  Object.assign(task, changes);
  await task.save();
  res.json({ data: task  });
};      
    

export { getAllTasks, getTaskById, createTask, deleteTask, updateTask };

          
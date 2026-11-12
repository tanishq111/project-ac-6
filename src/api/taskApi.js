import api from "./api";

export const getAllTasks = async () => await api.get("/api/tasks");
export const getTaskById = async (taskId) => await api.get(`/api/tasks/${taskId}`);
export const createTask = async (task) => await api.post("/api/tasks", task);
export const updateTask = async (taskId, task) => await api.patch(`/api/tasks/${taskId}`, task);
export const deleteTask = async (taskId) => await api.delete(`/api/tasks/${taskId}`);
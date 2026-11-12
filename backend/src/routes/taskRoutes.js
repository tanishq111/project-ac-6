import { Router } from "express";
import { getAllTasks, getTaskById, createTask, deleteTask, updateTask } from "../controller/taskController.js";
const router = Router();



router.get("/", getAllTasks);

router.get("/:taskId", getTaskById);

router.post("/", createTask);   

router.patch("/:taskId", updateTask);   
  

router.delete("/:taskId" , deleteTask);

export default router;
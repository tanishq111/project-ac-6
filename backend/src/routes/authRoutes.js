import { Router } from "express";
import { register, login, refreshToken } from "../controller/authController.js";
const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh-token", refreshToken);

export default router;
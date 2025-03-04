import express from "express";
import { register, login, getUser } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id", authenticateToken, getUser);

export default router;

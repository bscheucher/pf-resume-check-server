import express from "express";
import multer from "multer";
import {
  uploadResume,
  analyzeResumeController,
  getUserResumes,
  getResume,
  removeResume,
} from "../controllers/resumeController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("resume"), uploadResume);
router.post("/analyze", analyzeResumeController);
router.get("/:userId", authenticateToken, getUserResumes);
router.get("/:id", authenticateToken, getResume);
router.delete("/delete/:id", authenticateToken, removeResume);

export default router;

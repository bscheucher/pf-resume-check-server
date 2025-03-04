import express from "express";
import multer from "multer";
import {
  uploadResume,
  analyzeResumeController,
  getUserResumes,
  getResume,
  removeResume,
} from "../controllers/resumeController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("resume"), uploadResume);
router.post("/analyze", analyzeResumeController);
router.get("/:userId", getUserResumes);
router.get("/:id", getResume);
router.delete("/delete/:id", removeResume);

export default router;

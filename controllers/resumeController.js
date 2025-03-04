import { saveResume, analyzeResume, getResumesByUserId, getResumeById, deleteResume } from "../services/resumeService.js";

export const uploadResume = async (req, res) => {
  console.log("upload route called");
  console.log("Request body in upload route:", req.body);
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const savedResume = await saveResume(userId, req.file);
    res.json(savedResume);
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: "Error uploading resume", details: err.message });
  }
};

export const analyzeResumeController = async (req, res) => {
  try {
    const { resumeContent, jobDescription, resumeId } = req.body;

    const feedback = await analyzeResume(resumeContent, jobDescription, resumeId);
    res.json(feedback);
  } catch (err) {
    console.error("Error analyzing resume:", err);
    res.status(500).json({ error: "Error analyzing resume" });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "User ID is required." });

    const resumes = await getResumesByUserId(userId);
    res.json(resumes);
  } catch (err) {
    console.error("Error fetching resumes", err);
    res.status(500).json({ error: "Error fetching resumes" });
  }
};

export const getResume = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Resume ID is required." });

    const resume = await getResumeById(id);
    res.json(resume);
  } catch (err) {
    console.error(`Error fetching resume ID ${id}`, err);
    res.status(500).json({ error: `Error fetching resume ID ${id}` });
  }
};

export const removeResume = async (req, res) => {
    const { id } = req.params;
    try {
      await deleteResume(id);
      res.json({ message: "Resume deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
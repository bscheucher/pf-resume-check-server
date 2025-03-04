import pdfParse from "pdf-parse";
import pool from "../db.js";
import openai from "../openai.js";

export const saveResume = async (userId, file) => {
  const pdfData = await pdfParse(file.buffer);
  const newResume = await pool.query(
    "INSERT INTO cv_resumes (user_id, filename, content) VALUES ($1, $2, $3) RETURNING *",
    [userId, file.originalname, pdfData.text]
  );
  return newResume.rows[0];
};

export const analyzeResume = async (resumeContent, jobDescription, resumeId) => {
  const prompt = `
    Analyze the following resume against the job description and provide structured feedback:
    
    1. **Missing Keywords:** Identify key skills missing from the resume.
    2. **Resume Clarity & Formatting:** Assess readability and structure.
    3. **Relevance Score (0-100):** Rate how well this resume matches the job.
    
    **Resume:**
    ${resumeContent}
    
    **Job Description:**
    ${jobDescription}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4-0613",
    messages: [
      { role: "system", content: "You are a professional resume analyst." },
      { role: "user", content: prompt },
    ],
  });

  const suggestions = response.choices[0]?.message?.content || "No feedback generated";

  const feedbackEntry = await pool.query(
    "INSERT INTO cv_feedbacks (resume_id, feedback) VALUES ($1, $2) RETURNING *",
    [resumeId, suggestions]
  );

  return feedbackEntry.rows[0];
};

export const getResumesByUserId = async (userId) => {
  const resumes = await pool.query("SELECT * FROM cv_resumes WHERE user_id = $1", [userId]);
  return resumes.rows;
};

export const getResumeById = async (id) => {
  const resume = await pool.query("SELECT * FROM cv_resumes WHERE id = $1", [id]);
  return resume.rows[0];
};


export const deleteResume = async (id) => {
    await pool.query("DELETE FROM cv_resumes WHERE id = $1", [id]);
  };
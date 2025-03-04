import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const SECRET = process.env.JWT_SECRET;

export const registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await pool.query(
      "INSERT INTO cv_users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    return newUser.rows[0];
  } catch (err) {
    throw new Error("User already exists");
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: "1h" }
  );
};

export const getUserById = async (id) => {
  try {
    const user = await pool.query("SELECT * FROM cv_users WHERE id = $1", [id]);
    return user.rows[0] || null;
  } catch (err) {
    throw new Error("Error fetching user");
  }
};

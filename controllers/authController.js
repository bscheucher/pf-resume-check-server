import passport from "../config/passport.js";
import { registerUser, generateToken, getUserById } from "../services/authService.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = await registerUser(email, password);
    res.json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    req.logIn(user, (err) => {
      if (err) return next(err);

      const token = generateToken(user);
      res.status(201).json({
        message: "User logged in successfully!",
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    });
  })(req, res, next);
};

export const getUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).send("Invalid user ID.");

  try {
    const user = await getUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

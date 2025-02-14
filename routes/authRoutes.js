import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Render Register Page
router.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Render Login Page
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.redirect("/auth/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid Credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid Credentials");

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("jwt", token, { httpOnly: true }).redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Logout User
router.get("/logout", (req, res) => {
  res.clearCookie("jwt").redirect("/auth/login");
});

export default router;

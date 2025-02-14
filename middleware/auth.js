import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Ensure this is the correct path

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.jwt; // ✅ Ensure cookies are being used

  if (!token) {
    return res.redirect("/auth/login"); // 🔹 Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 🔥 Fetch user from the database, but only select the `name` field
    req.user = await User.findById(decoded.id).select("name");

    if (!req.user) {
      return res.redirect("/auth/login");
    }

    next();
  } catch (err) {
    console.error("Authentication Error:", err);
    res.redirect("/auth/login");
  }
};

export default authenticateUser;

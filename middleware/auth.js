import jwt from "jsonwebtoken";  // ✅ Ensure this import exists
import dotenv from "dotenv";

dotenv.config();

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];  // ✅ Extract JWT correctly

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default authenticateUser;

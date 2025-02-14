import express from "express";
import { Item } from "./models/Item.js";  // Notice the curly braces

import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Get User's To-Do List
router.get("/", authenticateUser, async (req, res) => {
    try {
        const items = await Item.find({ userId: req.user.id });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Add New Task
router.post("/add", authenticateUser, async (req, res) => {
    try {
        const newItem = new Item({ title: req.body.title, userId: req.user.id });
        await newItem.save();
        res.json({ message: "Task added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Task
router.post("/delete", authenticateUser, async (req, res) => {
    try {
        await Item.deleteOne({ _id: req.body.itemId, userId: req.user.id });
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

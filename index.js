import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"; // ✅ Correct import
import Item from "./models/Item.js";

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.render("index.ejs", { listTitle: "Today", listItems: items });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/add", async (req, res) => {
  const itemTitle = req.body.newItem;
  try {
    const newItem = new Item({ title: itemTitle });
    await newItem.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding item");
  }
});

app.post("/edit", async (req, res) => {
  const { updatedItemId, updatedItemTitle } = req.body;
  try {
    await Item.findByIdAndUpdate(updatedItemId, { title: updatedItemTitle });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating item");
  }
});

app.post("/delete", async (req, res) => {
  const { deleteItemId } = req.body;
  try {
    await Item.findByIdAndDelete(deleteItemId);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting item");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

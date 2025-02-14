// import express from "express";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import { connectDB } from "./config/db.js"; // ✅ Correct import
// import Item from "./models/Item.js";

// import authenticateUser from "./middleware/auth.js";
// import authRoutes from "./routes/authRoutes.js";
// import { Item } from "./models/Item.js";  // Notice the curly braces




// dotenv.config();
// connectDB(); // Connect to MongoDB

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// // app.get("/", async (req, res) => {
// //   try {
// //     const items = await Item.find();
// //     res.render("index.ejs", { listTitle: "Today", listItems: items });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send("Server error");
// //   }
// // });

// app.use("/auth", authRoutes);

// app.get("/dashboard", authenticateUser, async (req, res) => {
//   try {
//     res.render("dashboard.ejs", { user: req.user });
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });


// app.get("/", async (req, res) => {
//   try {
//     const items = await Item.find();

//     // Get the current day name (e.g., Monday, Tuesday)
//     const options = { weekday: "long" };
//     const dayName = new Date().toLocaleDateString("en-US", options);

//     res.render("index.ejs", { listTitle: dayName, listItems: items });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// app.get("/logout", (req, res) => {
//   res.clearCookie("jwt");
//   res.redirect("/");
// });


// app.post("/add", async (req, res) => {
//   const itemTitle = req.body.newItem;
//   try {
//     const newItem = new Item({ title: itemTitle });
//     await newItem.save();
//     res.redirect("/");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error adding item");
//   }
// });

// app.post("/edit", async (req, res) => {
//   const { updatedItemId, updatedItemTitle } = req.body;
//   try {
//     await Item.findByIdAndUpdate(updatedItemId, { title: updatedItemTitle });
//     res.redirect("/");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating item");
//   }
// });

// app.post("/delete", async (req, res) => {
//   const { deleteItemId } = req.body;
//   try {
//     await Item.findByIdAndDelete(deleteItemId);
//     res.redirect("/");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error deleting item");
//   }
// });

// app.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
// });

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import Item from "./models/Item.js";
import authenticateUser from "./middleware/auth.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/auth", authRoutes);

// Protect Dashboard
app.get("/dashboard", authenticateUser, (req, res) => {
  res.render("dashboard.ejs", { user: req.user });
});

// Protect To-Do List (Only for logged-in users)
app.get("/", authenticateUser, async (req, res) => {
  try {
    console.log("User Data:", req.user); // 🛠 Debugging: Check if user is fetched

    const items = await Item.find();
    const options = { weekday: "long" };
    const dayName = new Date().toLocaleDateString("en-US", options);

    res.render("index.ejs", { 
      listTitle: dayName, 
      listItems: items, 
      user: req.user || { name: "Guest" } // ✅ Fallback to "Guest" if missing
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("jwt").redirect("/auth/login");
});

// Add, Edit, and Delete To-Do Items
app.post("/add", authenticateUser, async (req, res) => {
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

app.post("/edit", authenticateUser, async (req, res) => {
  const { updatedItemId, updatedItemTitle } = req.body;
  try {
    await Item.findByIdAndUpdate(updatedItemId, { title: updatedItemTitle });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating item");
  }
});

app.post("/delete", authenticateUser, async (req, res) => {
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

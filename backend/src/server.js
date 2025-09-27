// -------------------- Imports --------------------

// CommonJS vs ES Modules
// const express = require("express");   // -> CommonJS (CJS)
import express from "express";           // -> ES Module (ESM) 
                                         // for this: add "type": "module" in package.json OR use .mjs extension

import path from "path";                 // For file paths
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";

// -------------------- App Setup --------------------



const app = express();
const __dirname = path.resolve();        // Required for ESM (since __dirname is not available by default)

// -------------------- Routes --------------------
app.use(express.json()); //req.body
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

// -------------------- Production Setup --------------------

if (ENV.NODE_ENV === "production") {
  // Serve frontend build files
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Fallback to index.html for SPA routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// -------------------- Start Server --------------------

const PORT = ENV.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
  connectDB();
});

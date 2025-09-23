// const express = require("express"); -> commonJs (CJS)

import express from "express";  // -> ES Module (ESM) -> for this mark the type:"module" or make the file extension as .mjs
const app = express();

//Setting up .env file configuration so that we can use the .env file variable
import dotenv from "dotenv";
dotenv.config();

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js"


app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

import path from "path";
const __dirname = path.resolve();  //use in module JS

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log("Server is running on ", PORT);
})
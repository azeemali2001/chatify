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

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log("Server is running on ", PORT);
})
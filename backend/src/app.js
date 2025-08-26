const express = require("express");
const app = express();
const morgan = require("morgan");

// === Middleware ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// === Routes ===
const authRoute = require("./routes/auth.route");
app.use("/auth", authRoute);

const todoRoute = require("./routes/todo.route");
app.use("/todo", todoRoute);

module.exports = app;

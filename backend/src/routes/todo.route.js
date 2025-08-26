const express = require("express");
const router = express.Router();

const {
  addTodo,
  getTodos,
  getTodoByID,
  completeTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo.controller");
const auth = require("../middleware/auth.middleware");

router.post("/create", auth, addTodo);

router.get("/list", auth, getTodos);

router.get("/list/:id", auth, getTodoByID);

router.get("/complete/:id", auth, completeTodo);

router.put("/update/:id", auth, updateTodo);

router.delete("/delete/:id", auth, deleteTodo);

module.exports = router;

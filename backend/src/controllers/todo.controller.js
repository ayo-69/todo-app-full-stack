const { client: db } = require("../config/db");

const addTodo = async (req, res) => {
  const { title, content } = req.body;
  const { id: user_id } = req.user;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO todos (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, user_id],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// FIX: The code below returns only one todo, rather than many todos
const getTodos = async (req, res) => {
  const { id: user_id } = req.user;

  try {
    const result = await db.query("SELECT * FROM todos WHERE user_id = $1", [
      user_id,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTodoByID = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM todos WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error getting todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const completeTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "UPDATE todos SET is_completed = true WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error completing todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const result = await db.query(
      "UPDATE todos SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title, content, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addTodo,
  getTodos,
  getTodoByID,
  completeTodo,
  updateTodo,
  deleteTodo,
};

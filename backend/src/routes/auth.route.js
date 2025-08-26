const express = require("express");
const router = express.Router();
const { client } = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/env.js");
const { registerSchema, loginSchema } = require("../util/validation.js");

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/login", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { id, name } = user.rows[0];
    res.status(200).json({ token, user: { id, email, name } });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, name, password } = req.body;

    const user = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await client.query(
      "INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name",
      [email, name, hashedPassword],
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

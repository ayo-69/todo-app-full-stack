const pkg = require("pg");
const { Client } = pkg;
const fs = require("fs");
const path = require("path");

const config = require("./env.js");

const client = new Client({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_DATABASE,
  password: config.DB_PASSWORD,
  port: 5432,
});

const createTables = async () => {
  const userSql = fs.readFileSync(path.join(__dirname, "../models/user.sql")).toString();
  const todoSql = fs.readFileSync(path.join(__dirname, "../models/todo.sql")).toString();

  await client.query(userSql);
  await client.query(todoSql);
};

const connect = async () => {
  try {
    await client.connect();
    console.log("Connected to database");
    await createTables();
    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

module.exports = { connect, client };

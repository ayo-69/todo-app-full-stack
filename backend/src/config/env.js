const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_USER = process.env.DB_USER || "admin";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_DATABASE = process.env.DB_DATABASE || "your_database";
const DB_PASSWORD = process.env.DB_PASSWORD || "your_password";
const JWT_SECRET = process.env.JWT_SECRET || "your_secret";

module.exports = {
  PORT,
  DB_USER,
  DB_HOST,
  DB_DATABASE,
  DB_PASSWORD,
  JWT_SECRET,
};

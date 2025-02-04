const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL connection using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database"))
  .catch(err => console.error("❌ Database connection error:", err.message));

/** ==========================
 * 🛡️ Authentication Routes
 ========================== */

// User Login
app.post('/login', async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    console.log("Login attempt with email:", email);

    // Check if email and password match hardcoded admin values
    if (email === 'admin@gmail.com' && password === 'admin') {
      return res.status(200).json({
        message: 'Login successful',
        user: { email: 'admin@gmail.com', name: 'Admin' },
      });
    }

    // Fetch user from database
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      console.log("User not found for email:", email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    console.log("User found:", user);

    // Compare password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.userid, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** ==========================
 * 📚 Learning Area Routes
 ========================== */

// Get all learning areas
app.get('/learning-areas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM LearningArea');
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching learning areas:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new learning area
app.post('/learning-areas', async (req, res) => {
  const { DomainName } = req.body;
  if (!DomainName) {
    return res.status(400).json({ error: "DomainName is required" });
  }

  try {
    const result = await pool.query(
      'INSERT INTO LearningArea (DomainName) VALUES ($1) RETURNING *',
      [DomainName]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding learning area:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a learning area
app.put('/learning-areas/:id', async (req, res) => {
  const { id } = req.params;
  const { DomainName } = req.body;

  try {
    const result = await pool.query(
      'UPDATE LearningArea SET DomainName = $1 WHERE LearningId = $2 RETURNING *',
      [DomainName, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Learning area not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating learning area:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a learning area
app.delete('/learning-areas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM LearningArea WHERE LearningId = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Learning area not found" });
    }

    res.json({ message: "Learning area deleted successfully" });
  } catch (err) {
    console.error("Error deleting learning area:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/** ==========================
 * 🌐 Server Initialization
 ========================== */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

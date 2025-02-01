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

app.post('/login', async (req, res) => {
    try {
      const email = req.body.email.toLowerCase();
      const password = req.body.password;
  
      console.log("Login attempt with email:", email);
  
      // Check if email and password match the hardcoded values
      if (email === 'admin@gmail.com' && password === 'admin') {
        return res.status(200).json({
          message: 'Login successful',
          user: { email: 'admin@gmail.com', name: 'Admin' },  // Customize the response as needed
        });
      }
  
      const userResult = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
      if (userResult.rows.length === 0) {
        console.log("User not found for email:", email);
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const user = userResult.rows[0];
      console.log("User found:", user);
  
      // Compare the password provided with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match result:", isMatch);
  
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      res.status(200).json({
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (err) {
      console.error("Error during login:", err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();



const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then((conn) => {
    conn.release();
    console.log("✅ Connected to MySQL Database");
  })
  .catch(err => console.error("❌ Database connection error:", err.message));

/** ==========================
 * 🛡️ Admin Authentication Routes
 ========================== */

// Admin Login
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Admin login attempt with email:", email);

    const [adminRows] = await pool.query(
      'SELECT id, email, password FROM admin WHERE email = ?',
      [email.toLowerCase()]
    );

    if (adminRows.length === 0) {
      console.log("Admin not found.");
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const admin = adminRows[0];
    if (password !== admin.password) {
      console.log("Password mismatch.");
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log("Login successful:", admin.email);
    res.status(200).json({
      message: 'Admin login successful',
      admin: { id: admin.id, email: admin.email },
    });
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new Admin
app.post('/admin/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  try {
    const [emailCheck] = await pool.query(
      'SELECT email FROM admin WHERE email = ?',
      [email.toLowerCase()]
    );

    if (emailCheck.length > 0) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admin (email, password) VALUES (?, ?)',
      [email.toLowerCase(), hashedPassword]
    );

    const [newAdmin] = await pool.query(
      'SELECT id, email FROM admin WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newAdmin[0]);
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/** ==========================
 * 👤 User Management Routes
 ========================== */

// Fetch all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT userid, name, email, phone, role, created_at, updated_at FROM users');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  const { name, email, phone, role } = req.body;
  if (!name || !email || !phone) return res.status(400).json({ error: "Name, email, and phone are required" });

  try {
    const defaultPassword = 'defaultPassword123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, phone, hashedPassword, role || 'student']
    );

    const [newUser] = await pool.query(
      'SELECT userid, name, email, phone, role, created_at, updated_at FROM users WHERE userid = ?',
      [result.insertId]
    );

    res.status(201).json(newUser[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, phone = ?, role = ?, updated_at = NOW() WHERE userid = ?',
      [name, email, phone, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const [updatedUser] = await pool.query(
      'SELECT userid, name, email, phone, role, updated_at FROM users WHERE userid = ?',
      [id]
    );

    res.json(updatedUser[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE userid = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/** ==========================
 * 📚 Learning Areas Routes
 ========================== */

// Get all learning areas
app.get('/learning-areas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM learningArea');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching learning areas:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new learning area
app.post('/learning-areas', async (req, res) => {
  const { DomainName } = req.body;
  if (!DomainName) return res.status(400).json({ error: "DomainName is required" });

  try {
    const [result] = await pool.query(
      'INSERT INTO learningArea (domainname) VALUES (?)',
      [DomainName]
    );

    const [newArea] = await pool.query(
      'SELECT * FROM learningArea WHERE learningid = ?',
      [result.insertId]
    );

    res.status(201).json(newArea[0]);
  
  } catch (err) {
    console.error("Error adding learning area:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a learning area
app.delete('/learning-areas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM learningArea WHERE learningid = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Learning area not found" });
    }

    res.json({ message: "Learning area deleted successfully" });
  } catch (err) {
    console.error("Error deleting learning area:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update the courses GET endpoint to include learning areas
app.get('/courses', async (req, res) => {
  try {
    const [courses] = await pool.query(`
      SELECT c.*, 
             GROUP_CONCAT(la.learningid) as learning_area_ids,
             GROUP_CONCAT(la.domainname) as learning_area_names
      FROM course c
      LEFT JOIN courselearningarea cla ON c.courseid = cla.courseid
      LEFT JOIN learningArea la ON cla.learningid = la.learningid
      GROUP BY c.courseid
    `);

    // Format the response to include learning areas as an array
    const formattedCourses = courses.map(course => ({
      ...course,
      learning_areas: course.learning_area_ids 
        ? course.learning_area_ids.split(',').map((id, index) => ({
            learningid: parseInt(id),
            domainname: course.learning_area_names.split(',')[index]
          }))
        : []
    }));

    res.json(formattedCourses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update the course creation endpoint to handle learning areas
app.post('/courses', async (req, res) => {
  const { title, description, price, learningAreaIds } = req.body;
  if (!title || !price) {
    return res.status(400).json({ error: "Title and price are required" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert the course
    const [courseResult] = await connection.query(
      'INSERT INTO course (title, description, price, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [title, description, price]
    );

    const courseId = courseResult.insertId;

    // Insert learning area associations
    if (learningAreaIds && learningAreaIds.length > 0) {
      const values = learningAreaIds.map(learningId => [courseId, learningId]);
      await connection.query(
        'INSERT INTO courselearningarea (courseid, learningid) VALUES ?',
        [values]
      );
    }

    // Fetch the complete course data with learning areas
    const [newCourse] = await connection.query(`
      SELECT c.*, 
             GROUP_CONCAT(la.learningid) as learning_area_ids,
             GROUP_CONCAT(la.domainname) as learning_area_names
      FROM course c
      LEFT JOIN courselearningarea cla ON c.courseid = cla.courseid
      LEFT JOIN learningArea la ON cla.learningid = la.learningid
      WHERE c.courseid = ?
      GROUP BY c.courseid
    `, [courseId]);

    await connection.commit();

    // Format the response
    const formattedCourse = {
      ...newCourse[0],
      learning_areas: newCourse[0].learning_area_ids 
        ? newCourse[0].learning_area_ids.split(',').map((id, index) => ({
            learningid: parseInt(id),
            domainname: newCourse[0].learning_area_names.split(',')[index]
          }))
        : []
    };

    res.status(201).json(formattedCourse);
  } catch (err) {
    await connection.rollback();
    console.error("Error adding course:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

// Update the course deletion endpoint to handle learning area associations
app.delete('/courses/:id', async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Delete learning area associations first
    await connection.query('DELETE FROM courselearningarea WHERE courseid = ?', [id]);
    
    // Then delete the course
    const [result] = await connection.query('DELETE FROM course WHERE courseid = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Course not found" });
    }

    await connection.commit();
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    await connection.rollback();
    console.error("Error deleting course:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
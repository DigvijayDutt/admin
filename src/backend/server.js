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

// Fetch user profile by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT userid, name, email, phone, role FROM users WHERE userid = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update user profile
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role, password } = req.body;

  try {
    let query = 'UPDATE users SET name = ?, email = ?, phone = ?, role = ?, updated_at = NOW() WHERE userid = ?';
    let values = [name, email, phone, role, id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE users SET name = ?, email = ?, phone = ?, role = ?, password = ?, updated_at = NOW() WHERE userid = ?';
      values = [name, email, phone, role, hashedPassword, id];
    }

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
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

/** ==========================
 * 🏫 Batch Management Routes (Optimized)
 ========================== */

// Get all batches with complete details
app.get('/batches', async (req, res) => {
  try {
    const [batches] = await pool.query(`
      SELECT 
        b.batchid,
        b.courseid,
        c.title AS course_title,
        c.description AS course_description,
        b.start_at,
        b.end_at,
        b.Duration,
        b.InstructorID,
        i.name AS instructor_name,
        i.email AS instructor_email,
        b.NoOfSeats,
        b.Status
      FROM CourseBatches b
      JOIN course c ON b.courseid = c.courseid
      JOIN users i ON b.InstructorID = i.userid 
        AND i.role = 'instructor'
      ORDER BY b.start_at DESC
    `);
    
    // Format dates
    const formattedBatches = batches.map(batch => ({
      ...batch,
      start_at: new Date(batch.start_at).toISOString().split('T')[0],
      end_at: new Date(batch.end_at).toISOString().split('T')[0]
    }));

    res.json(formattedBatches);
  } catch (err) {
    console.error("Error fetching batches:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create new batch with validation
app.post('/batches', async (req, res) => {
  const { courseid, InstructorID, start_at, end_at, Duration, NoOfSeats, Status } = req.body;
  
  // Validation
  if (!courseid || !InstructorID || !start_at || !end_at || !Duration || !NoOfSeats || !Status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Verify course exists
    const [course] = await pool.query('SELECT courseid FROM course WHERE courseid = ?', [courseid]);
    if (course.length === 0) return res.status(400).json({ error: "Invalid course ID" });

    // Verify instructor exists in users table
    const [instructor] = await pool.query(
      'SELECT userid FROM users WHERE userid = ? AND role = "instructor"',
      [InstructorID]
    );
    if (instructor.length === 0) return res.status(400).json({ error: "Invalid instructor ID" });

    // Create batch
    const [result] = await pool.query(
      `INSERT INTO CourseBatches 
      (courseid, InstructorID, start_at, end_at, Duration, NoOfSeats, Status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [courseid, InstructorID, start_at, end_at, Duration, NoOfSeats, Status]
    );

    // Get created batch with joins
    const [newBatch] = await pool.query(`
      SELECT 
        b.batchid,
        c.title AS course_title,
        i.name AS instructor_name,
        b.start_at,
        b.end_at,
        b.Duration,
        b.NoOfSeats,
        b.Status
      FROM CourseBatches b
      JOIN course c ON b.courseid = c.courseid
      JOIN users i ON b.InstructorID = i.userid
      WHERE b.batchid = ?
    `, [result.insertId]);

    res.status(201).json({
      ...newBatch[0],
      start_at: new Date(newBatch[0].start_at).toISOString().split('T')[0],
      end_at: new Date(newBatch[0].end_at).toISOString().split('T')[0]
    });
  } catch (error) {
    console.error("Error creating batch:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update batch with full validation
app.put('/batches/:id', async (req, res) => {
  const { id } = req.params;
  const { courseid, InstructorID, start_at, end_at, Duration, NoOfSeats, Status } = req.body;

  try {
    // Verify batch exists
    const [existingBatch] = await pool.query('SELECT batchid FROM CourseBatches WHERE batchid = ?', [id]);
    if (existingBatch.length === 0) return res.status(404).json({ error: "Batch not found" });

    // Verify course exists if being updated
    if (courseid) {
      const [course] = await pool.query('SELECT courseid FROM course WHERE courseid = ?', [courseid]);
      if (course.length === 0) return res.status(400).json({ error: "Invalid course ID" });
    }

    // Verify instructor exists in users table if being updated
    if (InstructorID) {
      const [instructor] = await pool.query(
        'SELECT userid FROM users WHERE userid = ? AND role = "instructor"',
        [InstructorID]
      );
      if (instructor.length === 0) return res.status(400).json({ error: "Invalid instructor ID" });
    }

    // Update batch
    const [result] = await pool.query(
      `UPDATE CourseBatches 
      SET courseid = ?, InstructorID = ?, start_at = ?, end_at = ?, 
          Duration = ?, NoOfSeats = ?, Status = ?
      WHERE batchid = ?`,
      [courseid, InstructorID, start_at, end_at, Duration, NoOfSeats, Status, id]
    );

    // Get updated batch with joins
    const [updatedBatch] = await pool.query(`
      SELECT 
        b.batchid,
        c.title AS course_title,
        i.name AS instructor_name,
        b.start_at,
        b.end_at,
        b.Duration,
        b.NoOfSeats,
        b.Status
      FROM CourseBatches b
      JOIN course c ON b.courseid = c.courseid
      JOIN users i ON b.InstructorID = i.userid
      WHERE b.batchid = ?
    `, [id]);

    res.json({
      ...updatedBatch[0],
      start_at: new Date(updatedBatch[0].start_at).toISOString().split('T')[0],
      end_at: new Date(updatedBatch[0].end_at).toISOString().split('T')[0]
    });
  } catch (err) {
    console.error("Error updating batch:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all instructors from users table
app.get('/instructors', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        userid AS instructor_id, 
        name, 
        email, 
        phone 
       FROM users 
       WHERE role = 'instructor'`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching instructors:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Add this to your backend routes
app.delete('/batches/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const [result] = await pool.query('DELETE FROM CourseBatches WHERE batchid = ?', [id]);
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Batch not found" });
      }
      res.status(204).send();
  } catch (err) {
      console.error("Error deleting batch:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

// In your server.js (backend)
// FAQ CRUD Endpoints

// Get all FAQs
app.get('/faqs', async (req, res) => {
  try {
    const [faqs] = await pool.query('SELECT * FROM faqs');
    res.json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new FAQ
app.post('/faqs', async (req, res) => {
  const { question, answer, category } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO faqs (question, answer, category) VALUES (?, ?, ?)',
      [question, answer, category]
    );
    
    const [newFAQ] = await pool.query('SELECT * FROM faqs WHERE id = ?', [result.insertId]);
    res.status(201).json(newFAQ[0]);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating FAQ' });
  }
});

// Update FAQ
app.put('/faqs/:id', async (req, res) => {
  const { id } = req.params;
  const { question, answer, category } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM faqs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await pool.query(
      'UPDATE faqs SET question = ?, answer = ?, category = ? WHERE id = ?',
      [question, answer, category, id]
    );

    const [updatedFAQ] = await pool.query('SELECT * FROM faqs WHERE id = ?', [id]);
    res.json(updatedFAQ[0]);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating FAQ' });
  }
});

// Delete FAQ
app.delete('/faqs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await pool.query('SELECT * FROM faqs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await pool.query('DELETE FROM faqs WHERE id = ?', [id]);
    res.json({ message: 'FAQ deleted successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting FAQ' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
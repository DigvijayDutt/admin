import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/CourseManage.css";

function CourseManage() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch courses when the component mounts
    axios.get('http://localhost:5000/courses')
      .then(response => setCourses(response.data))
      .catch(err => console.error("Error fetching courses:", err));
  }, []);

  // Function to add a course
  const addCourse = () => {
    if (courseName.trim() && courseDescription.trim() && coursePrice.trim()) {
      axios.post('http://localhost:5000/courses', {
        title: courseName,
        description: courseDescription,
        price: coursePrice
      })
      .then(response => {
        setCourses([...courses, response.data]);
        setCourseName('');
        setCourseDescription('');
        setCoursePrice('');
      })
      .catch(err => alert('Error adding course'));
    } else {
      alert('Please fill in all fields');
    }
  };

  // Function to delete a course
  const deleteCourse = (courseId) => {
    axios.delete(`http://localhost:5000/courses/${courseId}`)
      .then(() => {
        setCourses(courses.filter(course => course.courseid !== courseId));
      })
      .catch(err => alert('Error deleting course'));
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="course-manage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">Course Manager</div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </nav>

      {/* Header */}
      <header className="header">
        <h1>Welcome to Course Management</h1>
        <p>Organize and manage your courses and playlists efficiently.</p>
      </header>

      {/* Form to add a new course */}
      <div className="add-course-form">
        <input
          type="text"
          placeholder="Enter course name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter course description"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter course price"
          value={coursePrice}
          onChange={(e) => setCoursePrice(e.target.value)}
        />
        <button onClick={addCourse}>Add Course</button>
      </div>

      {/* Course List */}
      <div className="course-list">
        <h2>Existing Courses</h2>
        <ul>
          {filteredCourses.length === 0 ? <p>No courses available</p> :
            filteredCourses.map(course => (
              <li key={course.courseid}>
                <div className="course-header">
                  <div>
                    <span className="course-title">{course.title}</span>
                    <p className="course-description">{course.description}</p>
                    <p className="course-price">{course.price}</p>
                  </div>
                  <button className="delete-btn" onClick={() => deleteCourse(course.courseid)}>Delete</button>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default CourseManage;

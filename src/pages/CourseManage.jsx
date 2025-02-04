import React, { useState } from 'react';
import "../styles/CourseManage.css";

function CourseManage() {
  // State to hold the list of courses
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [playlistName, setPlaylistName] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // Function to add a course
  const addCourse = () => {
    if (courseName.trim() && courseDescription.trim()) {
      setCourses([...courses, { id: Date.now(), name: courseName, description: courseDescription, playlists: [] }]);
      setCourseName('');
      setCourseDescription('');
    } else {
      alert('Course name and description cannot be empty!');
    }
  };

  // Function to delete a course
  const deleteCourse = (courseId) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  // Function to add a playlist to a course
  const addPlaylist = (courseId) => {
    if (!playlistName[courseId]?.trim()) return alert('Playlist name cannot be empty!');

    setCourses(courses.map(course =>
      course.id === courseId
        ? { ...course, playlists: [...course.playlists, { id: Date.now(), name: playlistName[courseId] }] }
        : course
    ));

    setPlaylistName({ ...playlistName, [courseId]: '' });
  };

  // Function to delete a playlist
  const deletePlaylist = (courseId, playlistId) => {
    setCourses(courses.map(course =>
      course.id === courseId
        ? { ...course, playlists: course.playlists.filter(playlist => playlist.id !== playlistId) }
        : course
    ));
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <button onClick={addCourse}>Add Course</button>
      </div>

      {/* Course List */}
      <div className="course-list">
        <h2>Existing Courses</h2>
        <ul>
          {filteredCourses.length === 0 ? <p>No courses available</p> :
            filteredCourses.map(course => (
              <li key={course.id}>
                <div className="course-header">
                  <div>
                    <span className="course-title">{course.name}</span>
                    <p className="course-description">{course.description}</p>
                  </div>
                  <button className="delete-btn" onClick={() => deleteCourse(course.id)}>Delete</button>
                </div>

                {/* Playlist Management */}
                <div className="playlist-section">
                  <input
                    type="text"
                    placeholder="Add playlist"
                    value={playlistName[course.id] || ''}
                    onChange={(e) => setPlaylistName({ ...playlistName, [course.id]: e.target.value })}
                  />
                  <button onClick={() => addPlaylist(course.id)}>Add Playlist</button>
                </div>

                {/* Display Playlists */}
                <ul className="playlist-list">
                  {course.playlists.length === 0 ? <p>No playlists</p> :
                    course.playlists.map(playlist => (
                      <li key={playlist.id}>
                        {playlist.name}
                        <button className="delete-btn" onClick={() => deletePlaylist(course.id, playlist.id)}>Delete</button>
                      </li>
                    ))
                  }
                </ul>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default CourseManage;
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash, PencilSimpleLine } from "@phosphor-icons/react";
import NavBar from "../assets/Navbar";
import SideBar from "../assets/SideBar";
import '../styles/CourseManage.css';

function CourseManage() {
    const [courses, setCourses] = useState([]);
    const [learningAreas, setLearningAreas] = useState([]);
    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [coursePrice, setCoursePrice] = useState("");
    const [learningAreaIds, setLearningAreaIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesResponse, learningAreasResponse] = await Promise.all([
                    axios.get("http://localhost:5000/courses"),
                    axios.get("http://localhost:5000/learning-areas")
                ]);
                setCourses(coursesResponse.data);
                setLearningAreas(learningAreasResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const courseData = {
                title: courseName,
                description: courseDescription,
                price: parseFloat(coursePrice),
                learningAreaIds,
            };

            if (editingCourse) {
                // Update course
                const response = await axios.put(
                    `http://localhost:5000/courses/${editingCourse.courseId}`,
                    courseData
                );
                setCourses(courses.map(course => 
                    course.courseId === editingCourse.courseId ? response.data : course
                ));
            } else {
                // Create course
                const response = await axios.post(
                    "http://localhost:5000/courses",
                    courseData
                );
                setCourses([...courses, response.data]);
            }

            resetForm();
        } catch (err) {
            alert(`Error: ${err.response?.data?.message || err.message}`);
        }
    };

    const deleteCourse = async (courseId) => {
        try {
            await axios.delete(`http://localhost:5000/courses/${courseId}`);
            setCourses(courses.filter(course => course.courseId !== courseId));
        } catch (err) {
            alert(`Error deleting course: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setCourseName(course.title);
        setCourseDescription(course.description);
        setCoursePrice(course.price);
        setLearningAreaIds(course.learning_areas?.map(la => la.learningid) || []);
    };

    const resetForm = () => {
        setEditingCourse(null);
        setCourseName("");
        setCourseDescription("");
        setCoursePrice("");
        setLearningAreaIds([]);
    };

    const toggleLearningArea = (learningId) => {
        setLearningAreaIds(prev => 
            prev.includes(learningId) 
                ? prev.filter(id => id !== learningId) 
                : [...prev, learningId]
        );
    };

    return (
        <>
            <SideBar />
            <div className="course-management">
                <NavBar />
                
                <header className="CMheader">
                    <h1>Course Management</h1>
                    <p>Manage your courses and learning materials</p>
                </header>

                <div className="container">
                    <form onSubmit={handleSubmit} className="course-form">
                        <h2>{editingCourse ? 'Edit Course' : 'Create Course'}</h2>
                        
                        <div className="form-group">
                            <label>Course Name</label>
                            <input
                                type="text"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <input
                                type="text"
                                value={courseDescription}
                                onChange={(e) => setCourseDescription(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                value={coursePrice}
                                onChange={(e) => setCoursePrice(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Learning Areas</label>
                            <div className="learning-areas">
                                {learningAreas.map(area => (
                                    <label key={area.learningid}>
                                        <input
                                            type="checkbox"
                                            checked={learningAreaIds.includes(area.learningid)}
                                            onChange={() => toggleLearningArea(area.learningid)}
                                        />
                                        {area.domainname}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingCourse ? 'Update' : 'Create'}
                            </button>
                            {editingCourse && (
                                <button type="button" className="btn-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="course-list">
                        <h2>Course List</h2>
                        
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Learning Areas</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses
                                    .filter(course => 
                                        course.title.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map(course => (
                                        <tr key={course.courseId}>
                                            <td>{course.title}</td>
                                            <td>{course.description}</td>
                                            <td>${course.price}</td>
                                            <td>
                                                {course.learning_areas?.map(la => la.domainname).join(', ') || 'N/A'}
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(course)}
                                                >
                                                    <PencilSimpleLine />
                                                </button>
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => deleteCourse(course.courseId)}
                                                >
                                                    <Trash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseManage;
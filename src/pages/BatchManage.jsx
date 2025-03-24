import { useEffect, useState } from "react";
import NavBar from "../assets/Navbar";
import SideBar from "../assets/SideBar";
import "../styles/BatchManage.css";
import axios from "axios";

function BatchManage() {
    const [batches, setBatches] = useState([]);
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBatchId, setCurrentBatchId] = useState(null);
    const [batchForm, setBatchForm] = useState({
        courseid: "",
        InstructorID: "",
        start_at: "",
        end_at: "",
        Duration: "",
        NoOfSeats: "",
        Status: "Active",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [batchesRes, coursesRes, instructorsRes] = await Promise.all([
                    axios.get("http://localhost:5000/batches"),
                    axios.get("http://localhost:5000/courses"),
                    axios.get("http://localhost:5000/instructors")
                ]);
                setBatches(batchesRes.data);
                setCourses(coursesRes.data);
                setInstructors(instructorsRes.data);
            } catch (e) {
                console.error("Error fetching data:", e);
                alert("Error loading data. Please check console for details.");
            }
        };
        fetchData();
    }, []);

    const calculateDuration = (start, end) => {
        const diffTime = Math.abs(new Date(end) - new Date(start));
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleDateChange = (e) => {
        const newForm = { ...batchForm, [e.target.name]: e.target.value };
        if (newForm.start_at && newForm.end_at) {
            newForm.Duration = calculateDuration(newForm.start_at, newForm.end_at);
        }
        setBatchForm(newForm);
    };

    const handleChange = (e) => {
        setBatchForm({ ...batchForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...batchForm,
                Duration: parseInt(batchForm.Duration),
                NoOfSeats: parseInt(batchForm.NoOfSeats)
            };

            let response;
            if (isEditing) {
                response = await axios.put(
                    `http://localhost:5000/batches/${currentBatchId}`,
                    payload
                );
                setBatches(prev => prev.map(batch => 
                    batch.batchid === currentBatchId ? response.data : batch
                ));
                setIsEditing(false);
                setCurrentBatchId(null);
            } else {
                response = await axios.post("http://localhost:5000/batches", payload);
                setBatches(prev => [response.data, ...prev]);
            }

            alert(`Batch ${isEditing ? 'updated' : 'added'} successfully!`);
            setBatchForm({
                courseid: "",
                InstructorID: "",
                start_at: "",
                end_at: "",
                Duration: "",
                NoOfSeats: "",
                Status: "Active",
            });
        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleEdit = (batch) => {
        setIsEditing(true);
        setCurrentBatchId(batch.batchid);
        setBatchForm({
            courseid: batch.courseid,
            InstructorID: batch.InstructorID,
            start_at: batch.start_at,
            end_at: batch.end_at,
            Duration: batch.Duration.toString(),
            NoOfSeats: batch.NoOfSeats.toString(),
            Status: batch.Status,
        });
    };

    const handleDelete = async (batchId) => {
        if (window.confirm("Are you sure you want to delete this batch?")) {
            try {
                await axios.delete(`http://localhost:5000/batches/${batchId}`);
                setBatches(prev => prev.filter(batch => batch.batchid !== batchId));
                alert("Batch deleted successfully!");
            } catch (error) {
                console.error("Error deleting batch:", error);
                alert(`Error: ${error.response?.data?.error || error.message}`);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="BMcontainer">
            <NavBar />
            <SideBar />
            
            <div className="BM-content">
                <div className="BMform">
                    <h2>{isEditing ? "Edit Batch" : "Create New Batch"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Course:</label>
                            <select
                                className="form-control"
                                name="courseid"
                                value={batchForm.courseid}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course.courseid} value={course.courseid}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Instructor:</label>
                            <select
                                className="form-control"
                                name="InstructorID"
                                value={batchForm.InstructorID}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Instructor</option>
                                {instructors.map(instructor => (
                                    <option key={instructor.instructor_id} value={instructor.instructor_id}>
                                        {instructor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="start_at"
                                    value={batchForm.start_at}
                                    onChange={handleDateChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="end_at"
                                    value={batchForm.end_at}
                                    onChange={handleDateChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Duration (days):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="Duration"
                                    value={batchForm.Duration}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Available Seats:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="NoOfSeats"
                                    value={batchForm.NoOfSeats}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group status-group">
                            <label>Status:</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="Status"
                                        value="Active"
                                        checked={batchForm.Status === "Active"}
                                        onChange={handleChange}
                                    />
                                    Active
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="Status"
                                        value="Inactive"
                                        checked={batchForm.Status === "Inactive"}
                                        onChange={handleChange}
                                    />
                                    Inactive
                                </label>
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="btn-primary">
                                {isEditing ? "Update Batch" : "Create Batch"}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setCurrentBatchId(null);
                                        setBatchForm({
                                            courseid: "",
                                            InstructorID: "",
                                            start_at: "",
                                            end_at: "",
                                            Duration: "",
                                            NoOfSeats: "",
                                            Status: "Active",
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="BMtable">
                    <h2>Batch List</h2>
                    {batches.length === 0 ? (
                        <p className="no-data">No batches found</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="batch-table">
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Instructor</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Duration</th>
                                        <th>Seats</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batches.map((batch) => (
                                        <tr key={batch.batchid}>
                                            <td>{batch.course_title}</td>
                                            <td>{batch.instructor_name}</td>
                                            <td>{formatDate(batch.start_at)}</td>
                                            <td>{formatDate(batch.end_at)}</td>
                                            <td>{batch.Duration} days</td>
                                            <td>{batch.NoOfSeats}</td>
                                            <td>
                                                <span className={`status-badge ${batch.Status.toLowerCase()}`}>
                                                    {batch.Status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-icons">
                                                    <button 
                                                        className="icon-btn edit-btn"
                                                        onClick={() => handleEdit(batch)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="icon-btn delete-btn"
                                                        onClick={() => handleDelete(batch.batchid)}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BatchManage;
import React, { useEffect, useState } from "react";
import "../styles/learning.css";

// Modal component for confirmation
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{message}</h3>
        <div className="modal-actions">
          <button onClick={onConfirm} className="btn btn-confirm">Yes</button>
          <button onClick={onCancel} className="btn btn-cancel">No</button>
        </div>
      </div>
    </div>
  );
};

const Learning = () => {
  const [learningAreas, setLearningAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingArea, setEditingArea] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDetails, setUpdatedDetails] = useState("");
  const [updatedCourses, setUpdatedCourses] = useState(0);
  const [updatedStudents, setUpdatedStudents] = useState(0);
  const [newLearningArea, setNewLearningArea] = useState("");
  const [detailsArea, setDetailsArea] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);

  useEffect(() => {
    fetchLearningAreas().catch((error) => {
      console.error("Fetching error:", error);
      setError("An error occurred while loading data.");
      setLoading(false);
    });
  }, []);

  const fetchLearningAreas = async () => {
    try {
      const response = { data: [
        { id: 1, name: "Data Structures", details: "Learn about algorithms, trees, graphs, and more.", numberOfCourses: 3, enrolledStudents: 120 },
        { id: 2, name: "Operating Systems", details: "Understand the core functions of an OS, memory management, etc.", numberOfCourses: 4, enrolledStudents: 95 },
        { id: 3, name: "Computer Networks", details: "Learn about network topologies, protocols, and security.", numberOfCourses: 5, enrolledStudents: 150 },
        { id: 4, name: "Database Management Systems", details: "Study the design and implementation of database systems.", numberOfCourses: 3, enrolledStudents: 80 },
        { id: 5, name: "Software Engineering", details: "Focus on development life cycles, testing, and project management.", numberOfCourses: 2, enrolledStudents: 200 }
      ]};
      setLearningAreas(response.data);
    } catch (error) {
      console.error("Error fetching learning areas:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    const areaToEdit = learningAreas.find((area) => area.id === id);
    setEditingArea(areaToEdit);
    setUpdatedName(areaToEdit.name);
    setUpdatedDetails(areaToEdit.details);
    setUpdatedCourses(areaToEdit.numberOfCourses);
    setUpdatedStudents(areaToEdit.enrolledStudents);
  };

  const handleSaveUpdate = (id) => {
    const updatedAreas = learningAreas.map((area) =>
      area.id === id
        ? { 
            ...area, 
            name: updatedName, 
            details: updatedDetails, 
            numberOfCourses: updatedCourses, 
            enrolledStudents: updatedStudents 
          }
        : area
    );
    setLearningAreas(updatedAreas);
    setEditingArea(null);
    setUpdatedName("");
    setUpdatedDetails("");
    setUpdatedCourses(0);
    setUpdatedStudents(0);
  };

  const handleDelete = (id) => {
    setAreaToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const updatedLearningAreas = learningAreas.filter((area) => area.id !== areaToDelete);
    setLearningAreas(updatedLearningAreas);
    setShowDeleteModal(false);
    setAreaToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setAreaToDelete(null);
  };

  const handleAddLearningArea = () => {
    if (!newLearningArea.trim()) {
      alert("Please enter a valid name.");
      return;
    }
    const newArea = {
      id: learningAreas.length + 1, // Generate a new ID (for demo purposes)
      name: newLearningArea.trim(),
      details: "No details available for this area.", // Default details
      numberOfCourses: 0,
      enrolledStudents: 0,
    };
    setLearningAreas((prev) => [...prev, newArea]);
    setNewLearningArea(""); // Reset the input field
  };

  const handleViewDetails = (id) => {
    const area = learningAreas.find((area) => area.id === id);
    setDetailsArea(area);
  };

  return (
    <div className="container">
      <h1 className="title">User Management - Learning Areas</h1>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Add Learning Area Form */}
      <div className="add-area">
        <input
          type="text"
          value={newLearningArea}
          onChange={(e) => setNewLearningArea(e.target.value)}
          placeholder="Enter new learning area"
          className="add-input"
        />
        <button onClick={handleAddLearningArea} className="btn btn-add">
          Add Learning Area
        </button>
      </div>

      {/* View Learning Area Details */}
      {detailsArea && (
        <div className="details">
          <h2>Details for {detailsArea.name}</h2>
          <p>{detailsArea.details}</p>
          <p><strong>Number of Courses:</strong> {detailsArea.numberOfCourses}</p>
          <p><strong>Enrolled Students:</strong> {detailsArea.enrolledStudents}</p>
          <button onClick={() => setDetailsArea(null)} className="btn btn-close">Close Details</button>
        </div>
      )}

      {/* Learning Areas Table */}
      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Details</th>
              <th>Courses</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {learningAreas.length > 0 ? (
              learningAreas.map((area) => (
                <tr key={area.id}>
                  <td>{area.id}</td>
                  <td>
                    {editingArea && editingArea.id === area.id ? (
                      <input
                        type="text"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      area.name
                    )}
                  </td>
                  <td>
                    {editingArea && editingArea.id === area.id ? (
                      <input
                        type="text"
                        value={updatedDetails}
                        onChange={(e) => setUpdatedDetails(e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      area.details
                    )}
                  </td>
                  <td>
                    {editingArea && editingArea.id === area.id ? (
                      <input
                        type="number"
                        value={updatedCourses}
                        onChange={(e) => setUpdatedCourses(e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      area.numberOfCourses
                    )}
                  </td>
                  <td>
                    {editingArea && editingArea.id === area.id ? (
                      <input
                        type="number"
                        value={updatedStudents}
                        onChange={(e) => setUpdatedStudents(e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      area.enrolledStudents
                    )}
                  </td>
                  <td>
                    {editingArea && editingArea.id === area.id ? (
                      <button
                        onClick={() => handleSaveUpdate(area.id)}
                        className="btn btn-save"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdate(area.id)}
                        className="btn btn-update"
                      >
                        Update
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(area.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewDetails(area.id)}
                      className="btn btn-details"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No learning areas available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal 
          message="Are you sure you want to delete this learning area?" 
          onConfirm={handleConfirmDelete} 
          onCancel={handleCancelDelete} 
        />
      )}
    </div>
  );
};

export default Learning;

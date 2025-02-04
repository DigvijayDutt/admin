import React, { useState, useEffect } from "react";

const Learning = () => {
  const [learningAreas, setLearningAreas] = useState([]);
  const [newLearningArea, setNewLearningArea] = useState("");
  const [editingArea, setEditingArea] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);

  // Fetch learning areas from backend
  const fetchLearningAreas = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/learning-areas");
      if (!response.ok) {
        throw new Error("Failed to load data");
      }
      const data = await response.json();
      console.log(data);  // Debugging: log the data to see the structure
      setLearningAreas(data);
      setError("");
    } catch (error) {
      console.error("Error fetching learning areas:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningAreas();
  }, []);

  // Handle adding a new learning area
  const handleAddLearningArea = async () => {
    if (!newLearningArea.trim()) return;
    try {
      const response = await fetch("http://localhost:5000/learning-areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ DomainName: newLearningArea.trim() }),
      });
      if (response.ok) {
        fetchLearningAreas();
        setNewLearningArea("");
      }
    } catch (error) {
      console.error("Error adding learning area:", error);
    }
  };

  // Handle editing a learning area
  const handleEdit = (area) => {
    setEditingArea(area.LearningId);
    setUpdatedName(area.DomainName);
  };

  // Save the updated learning area
  const handleSaveUpdate = async (id) => {
    try {
      await fetch(`http://localhost:5000/learning-areas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ DomainName: updatedName }),
      });
      fetchLearningAreas();
      setEditingArea(null);
      setUpdatedName("");
    } catch (error) {
      console.error("Error updating learning area:", error);
    }
  };

  // Handle deleting a learning area
  const handleDelete = (id) => {
    setAreaToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm the deletion of a learning area
  const handleConfirmDelete = async () => {
    try {
      await fetch(`http://localhost:5000/learning-areas/${areaToDelete}`, {
        method: "DELETE",
      });
      fetchLearningAreas();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting learning area:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Learning Areas</h2>
      <div className="add-area">
        <input
          type="text"
          className="add-input"
          placeholder="Enter new learning area"
          value={newLearningArea}
          onChange={(e) => setNewLearningArea(e.target.value)}
        />
        <button className="btn btn-add" onClick={handleAddLearningArea}>Add</button>
      </div>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {learningAreas.length === 0 ? (
              <tr>
                <td colSpan="2" className="no-data">No learning areas available</td>
              </tr>
            ) : (
              learningAreas.map((area) => {
                console.log(area);  // Debugging: log each area object
                return (
                  <tr key={area.LearningId}>
                    <td>
                      {editingArea === area.LearningId ? (
                        <input
                          type="text"
                          className="add-input"
                          value={updatedName}
                          onChange={(e) => setUpdatedName(e.target.value)}
                        />
                      ) : (
                        area.DomainName
                      )}
                    </td>
                    <td>
                      {editingArea === area.LearningId ? (
                        <button className="btn btn-save" onClick={() => handleSaveUpdate(area.LearningId)}>Save</button>
                      ) : (
                        <button className="btn btn-update" onClick={() => handleEdit(area)}>Edit</button>
                      )}
                      <button className="btn btn-danger" onClick={() => handleDelete(area.LearningId)}>Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure?</h3>
            <div className="modal-actions">
              <button className="btn btn-confirm" onClick={handleConfirmDelete}>Confirm</button>
              <button className="btn btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learning;

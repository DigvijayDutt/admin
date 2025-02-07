import React, { useState, useEffect } from "react";
import SideBar from "../assets/SideBar";
const Learning = () => {
  const [learningAreas, setLearningAreas] = useState([]);
  const [newLearningArea, setNewLearningArea] = useState("");
  const [editingArea, setEditingArea] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);

  const API_URL = "http://localhost:5000/learning-areas"; // Base URL

  // Fetch learning areas from backend
  const fetchLearningAreas = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to load data");
      const data = await response.json();
      console.log("Fetched learning areas:", data); // Debugging log
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
    if (!newLearningArea.trim()) return alert("Enter a valid learning area name.");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ DomainName: newLearningArea.trim() }),
      });
      if (!response.ok) throw new Error("Failed to add learning area");
      fetchLearningAreas();
      setNewLearningArea("");
    } catch (error) {
      console.error("Error adding learning area:", error);
      alert("Error adding learning area.");
    }
  };

  // Handle editing a learning area
  const handleEdit = (area) => {
    setEditingArea(area.learningid); // Ensure ID is correctly referenced
    setUpdatedName(area.domainname);
  };

  // Save the updated learning area
  const handleSaveUpdate = async (id) => {
    if (!updatedName.trim()) return alert("Enter a valid name.");
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ DomainName: updatedName }),
      });
      if (!response.ok) throw new Error("Failed to update learning area");
      fetchLearningAreas();
      setEditingArea(null);
      setUpdatedName("");
    } catch (error) {
      console.error("Error updating learning area:", error);
      alert("Error updating learning area.");
    }
  };

  // Handle deleting a learning area (opens modal)
  const handleDelete = (id) => {
    setAreaToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm the deletion of a learning area
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${areaToDelete}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete learning area");
      fetchLearningAreas();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting learning area:", error);
      alert("Error deleting learning area.");
    }
  };

  return (
    <div className="cunt">
      <SideBar />
    <div className="container">
      <h2 className="title">Learning Areas</h2>

      {/* Add New Learning Area */}
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

      {/* Loading & Error Messages */}
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
              learningAreas.map((area) => (
                <tr key={area.learningid}>
                  <td>
                    {editingArea === area.learningid ? (
                      <input
                        type="text"
                        className="add-input"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                      />
                    ) : (
                      area.domainname
                    )}
                  </td>
                  <td>
                    {editingArea === area.learningid ? (
                      <button className="btn btn-save" onClick={() => handleSaveUpdate(area.learningid)}>Save</button>
                    ) : (
                      <button className="btn btn-update" onClick={() => handleEdit(area)}>Edit</button>
                    )}
                    <button className="btn btn-danger" onClick={() => handleDelete(area.learningid)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Delete Confirmation Modal */}
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
    </div>
  );
};

export default Learning;

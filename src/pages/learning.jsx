import React, { useState, useEffect } from "react";
import SideBar from "../assets/SideBar";
import NavBar from "../assets/Navbar";
import { Trash, PencilSimpleLine } from "@phosphor-icons/react";
import "../styles/learning.css";

const Learning = () => {
  const [learningAreas, setLearningAreas] = useState([]);
  const [newLearningArea, setNewLearningArea] = useState("");
  const [editingArea, setEditingArea] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);

  const API_URL = "http://localhost:5000/learning-areas";

  useEffect(() => {
    fetchLearningAreas();
  }, []);

  const fetchLearningAreas = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setLearningAreas(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
      alert("Error adding learning area.");
    }
  };

  const handleEdit = (area) => {
    setEditingArea(area.learningid);
    setUpdatedName(area.domainname);
  };

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
    } catch (error) {
      alert("Error updating learning area.");
    }
  };

  const handleDelete = (id) => {
    setAreaToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${areaToDelete}`, { 
        method: "DELETE" 
      });
      if (!response.ok) throw new Error("Failed to delete learning area");
      fetchLearningAreas();
      setShowDeleteModal(false);
    } catch (error) {
      alert("Error deleting learning area.");
    }
  };

  return (
    <>
      <SideBar />
      <div className="learning-management">
        <NavBar />
        
        <header className="LMheader">
          <h1>Learning Areas Management</h1>
          <p>Manage and organize your learning domains</p>
        </header>

        <div className="container">
          <div className="learning-form">
            <h2>{editingArea ? 'Edit Learning Area' : 'Create New Area'}</h2>
            <div className="form-group">
              <label>Domain Name</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter learning area name"
                  value={editingArea ? updatedName : newLearningArea}
                  onChange={(e) => 
                    editingArea 
                      ? setUpdatedName(e.target.value) 
                      : setNewLearningArea(e.target.value)
                  }
                />
                <button 
                  className={`btn-primary ${editingArea ? 'btn-update' : ''}`}
                  onClick={editingArea 
                    ? () => handleSaveUpdate(editingArea) 
                    : handleAddLearningArea
                  }
                >
                  {editingArea ? 'Update' : 'Create'}
                </button>
              </div>
              {editingArea && (
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    setEditingArea(null);
                    setUpdatedName("");
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="learning-list">
            <h2>Learning Domains</h2>
            
            {loading ? (
              <div className="skeleton-loader">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton-row" />
                ))}
              </div>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Domain Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {learningAreas.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="no-data">
                        No learning areas available
                      </td>
                    </tr>
                  ) : (
                    learningAreas.map((area) => (
                      <tr key={area.learningid}>
                        <td>{area.domainname}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-edit"
                              onClick={() => handleEdit(area)}
                            >
                              <PencilSimpleLine size={18} />
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(area.learningid)}
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="confirmation-modal">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this learning area?</p>
              <div className="modal-actions">
                <button 
                  className="btn-delete" 
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Learning;
import React, { useState } from "react";
import axios from "axios";
import "../styles/profile-settings.css";
import NavBar from "../assets/Navbar";

const Settings = () => {
  const userId = 1; // Replace with actual user ID
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    axios
      .put(`http://localhost:5000/users/${userId}`, { password })
      .then(() => alert("Password updated successfully"))
      .catch((error) => console.error("Error updating password:", error));
  };

  return (
    <div>
      <NavBar />
      <h2 className="profile-settings-title">Settings</h2>
      <div className="profile-settings-container">
      <form onSubmit={handleSubmit} className="profile-settings-form ">
        <label>
          New Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <label>
          Confirm Password:
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </label>
        <br />
        <div className="profile-settings-buttons">
        <button type="submit" className="save-btn">Update Password</button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Settings;

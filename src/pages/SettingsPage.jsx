import React, { useState } from "react";
import axios from "axios";

const SettingsPage = () => {
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
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default SettingsPage;

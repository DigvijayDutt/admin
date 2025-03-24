import React, { useEffect, useState } from "react";
import axios from "axios";
import ""

const ProfilePage = () => {
  const userId = 1; // Replace with the actual user ID (can be dynamic)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${userId}`)
      .then((response) => setProfile(response.data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/users/${userId}`, profile)
      .then(() => alert("Profile updated successfully"))
      .catch((error) => console.error("Error updating profile:", error));
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={profile.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={profile.email} onChange={handleChange} disabled />
        </label>
        <br />
        <label>
          Phone:
          <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
        </label>
        <br />
        <label>
          Role:
          <input type="text" name="role" value={profile.role} onChange={handleChange} disabled />
        </label>
        <br />
        <button type="submit" className="save-btn">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;

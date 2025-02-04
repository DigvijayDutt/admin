import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/UserManage.css";

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Fetch users from the backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle form submission (create or update user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, email, phone: mobile, address: { city, state } };

    try {
      if (editingUser) {
        // Update existing user
        await axios.put(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, newUser);
        setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...newUser } : user)));
      } else {
        // Create new user
        const response = await axios.post('https://jsonplaceholder.typicode.com/users', newUser);
        setUsers([...users, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Handle editing a user
  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setMobile(user.phone);
    setCity(user.address?.city || '');
    setState(user.address?.state || '');
  };

  // Handle deleting a user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Reset the form
  const resetForm = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setMobile('');
    setCity('');
    setState('');
  };

  return (
    <div className="user-management">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">Admin Dashboard</div>
        <ul className="navbar-nav">
          <li><a href="/">Home</a></li>
          <li><a href="/dash">Dashboard</a></li>
          <li><a href="/users">Users</a></li>
        </ul>
      </nav>

      {/* Header */}
      <header className="header">
        <h1>User Management</h1>
        <p>Manage your users efficiently</p>
      </header>

      {/* Main Content */}
      <div className="container">
        <form onSubmit={handleSubmit} className="user-form">
          <h2>{editingUser ? 'Edit User' : 'Create User'}</h2>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mobile No.</label>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              placeholder="Enter state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingUser ? 'Update' : 'Create'}
            </button>
            {editingUser && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="user-list">
          <h2>User List</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <div className="user-info">
                  <span><strong>Name:</strong> {user.name}</span>
                  <span><strong>Email:</strong> {user.email}</span>
                  <span><strong>Mobile:</strong> {user.phone}</span>
                  <span><strong>City:</strong> {user.address?.city}</span>
                  <span><strong>State:</strong> {user.address?.state}</span>
                </div>
                <div className="user-actions">
                  <button onClick={() => handleEdit(user)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserManage;
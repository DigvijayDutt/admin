import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/UserManage.css";
import SideBar from '../assets/SideBar';
import NavBar from '../assets/Navbar';
import { Trash, PencilSimpleLine } from "@phosphor-icons/react";

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('student'); // Default role

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, email, phone: mobile, role };

    try {
      if (editingUser) {
        await axios.put(`http://localhost:5000/users/${editingUser.userid}`, newUser);
        setUsers(users.map((user) => (user.userid === editingUser.userid ? { ...user, ...newUser } : user)));
      } else {
        const response = await axios.post('http://localhost:5000/users', newUser);
        setUsers([...users, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setMobile(user.phone);
    setRole(user.role);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      setUsers(users.filter((user) => user.userid !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setMobile('');
    setRole('student'); // Reset to default role
  };

  return (
    <>
      <SideBar />
      <div className="user-management">
        <NavBar />
        <header className="UMheader">
          <h1>User Management</h1>
          <p>Manage your users efficiently</p>
        </header>

        <div className="container">
          <form onSubmit={handleSubmit} className="user-form">
            <h2>{editingUser ? 'Edit User' : 'Create User'}</h2>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Mobile No.</label>
              <input type="tel" placeholder="Enter mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="student">Student</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">{editingUser ? 'Update' : 'Create'}</button>
              {editingUser && (
                <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>

          <div className="user-list">
            <h2>User List</h2>
            <div className='user-actions'>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userid}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.role}</td>
                      <td>
                        <button onClick={() => handleEdit(user)} className="btn-edit">
                          <PencilSimpleLine />
                        </button>
                        <button onClick={() => handleDelete(user.userid)} className="btn-delete">
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
      </div>
    </>
  );
};

export default UserManage;
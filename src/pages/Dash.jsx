import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../assets/Navbar';
import SideBar from '../assets/SideBar';
import '../styles/dash.css';
import { LineChart, PieChart } from '@mui/x-charts';
import { Icon } from '@mui/material';
import { AddCircleOutline, PersonAdd } from '@mui/icons-material';

function Dash() {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [activities] = useState([
        { type: 'user', action: 'New registration', time: '2h ago' },
        { type: 'course', action: 'Course updated', time: '4h ago' },
        { type: 'payment', action: 'Payment received', time: '1d ago' }
    ]);
    const [summary, setSummary] = useState({
        activeUsers: 0,
        pendingApprovals: 0,
        pendingPayments: 0,
        courses: 0,
    });

    useEffect(() => {
        axios.get('http://localhost:5000/users')
            .then(response => {
                setUsers(response.data);
                setSummary(prev => ({ ...prev, activeUsers: response.data.length }));
            })
            .catch(error => console.error('Error fetching users:', error));

        axios.get('http://localhost:5000/courses')
            .then(response => {
                setCourses(response.data);
                setSummary(prev => ({ ...prev, courses: response.data.length }));
            })
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    return (
        <div className="dashboard">
            <SideBar />
            <div className="main-content">
                <NavBar />
                <header className="header">
                    <h1 className="header-title">Admin Dashboard</h1>
                    <div className="header-actions">
                        <button className="primary-btn">
                            <PersonAdd fontSize="small" />
                            Add User
                        </button>
                        <button className="primary-btn">
                            <AddCircleOutline fontSize="small" />
                            Add Course
                        </button>
                    </div>
                </header>

                <div className="summary-cards">
                    {Object.entries(summary).map(([key, value]) => (
                        <div key={key} className="summary-card">
                            <div className="card-content">
                                <span className="card-value">{value}</span>
                                <span className="card-title">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="content-wrapper">
                    <div className="main-section">
                        <div className="data-table card">
                            <div className="table-header">
                                <h3>Recent Users</h3>
                                <Link to="/users" className="view-all">
                                    View All <Icon>chevron_right</Icon>
                                </Link>
                            </div>
                            <table className='dash-table'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.slice(0, 5).map(user => (
                                        <tr key={user.userid}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <span className="status-badge active">Active</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="charts-grid">
                            <div className="chart-card">
                                <h4>User Distribution</h4>
                                <PieChart
                                    series={[{
                                        data: [
                                            { id: 0, value: 65, label: 'Active' },
                                            { id: 1, value: 15, label: 'Inactive' },
                                            { id: 2, value: 20, label: 'Pending' },
                                        ],
                                        colors: ['#2ecc71', '#e74c3c', '#f1c40f']
                                    }]}
                                    height={220}
                                />
                            </div>
                            <div className="chart-card">
                                <h4>Monthly Progress</h4>
                                <LineChart
                                    xAxis={[{ data: [1, 2, 3, 4, 5, 6] }]}
                                    series={[{
                                        data: [2, 5.5, 3, 8.5, 4, 5],
                                        color: '#3498db',
                                        curve: 'natural',
                                    }]}
                                    height={220}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="activity-section">
                        <div className="activity-card">
                            <h4>Recent Activity</h4>
                            <div className="activity-list">
                                {activities.map((activity, index) => (
                                    <div key={index} className="activity-item">
                                        <div className="activity-icon">
                                            {activity.type === 'user' && <PersonAdd fontSize="small" />}
                                            {activity.type === 'course' && <AddCircleOutline fontSize="small" />}
                                            {activity.type === 'payment' && <Icon fontSize="small">payment</Icon>}
                                        </div>
                                        <div className="activity-details">
                                            <span>{activity.action}</span>
                                            <small>{activity.time}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dash;
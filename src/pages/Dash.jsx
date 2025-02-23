import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../assets/NavBar';
import axios from 'axios'; // Import Axios for API requests
import '../styles/dash.css';
import SideBar from '../assets/SideBar';
import { LineChart,PieChart } from '@mui/x-charts';

function Dash() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [users, setUsers] = useState([]); // State to hold user data
    const [courses, setCourses] = useState([]); // State to hold course data
    const [summary, setSummary] = useState({
        activeUsers: 0,
        pendingApprovals: 0,
        pendingPayments: 0,
        courses: 0,
    });

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Fetch data from backend when the component mounts
    useEffect(() => {
        // Fetch users data
        axios.get('http://localhost:5000/users')
            .then(response => {
                setUsers(response.data);
                setSummary(prevSummary => ({
                    ...prevSummary,
                    activeUsers: response.data.length, // Example: Count active users
                }));
            })
            .catch(error => console.error('Error fetching users:', error));

        // Fetch courses data
        axios.get('http://localhost:5000/courses')
            .then(response => {
                setCourses(response.data);
                setSummary(prevSummary => ({
                    ...prevSummary,
                    courses: response.data.length, // Example: Count courses
                }));
            })
            .catch(error => console.error('Error fetching courses:', error));

        // Fetch additional data like pending approvals or payments if applicable
        // Example: setSummary with pending approvals and payments here
    }, []); // Empty array ensures this effect runs once when the component mounts

    return (
        <div className="dashboard">
            {/* Sidebar Navigation */}
            <SideBar />
            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <NavBar />
                <header className="header">
                    <div className='header-left'>
                        <h1 className="header-title">Admin Dashboard</h1>
                    </div>
                    <div className='header-right'>
                        <button onClick={handleMenu} className="account-btn">Account</button>
                        {anchorEl && (
                            <div className="menu">
                                <div onClick={handleClose}>Profile</div>
                                <div onClick={handleClose}>Logout</div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Dashboard Summary */}
                <div className="summary-cards">
                    <div className="card">
                        <div className="card-title">Active Users</div>
                        <div className="card-value">{summary.activeUsers}</div>
                    </div>
                    <div className="card">
                        <div className="card-title">Pending Approvals</div>
                        <div className="card-value">{summary.pendingApprovals}</div>
                    </div>
                    <div className="card">
                        <div className="card-title">Pending Payments</div>
                        <div className="card-value">{summary.pendingPayments}</div>
                    </div>
                    <div className="card">
                        <div className="card-title">Courses</div>
                        <div className="card-value">{summary.courses}</div>
                    </div>
                </div>

                {/* User Management Table */}
                <div className="data-table">
                    <h3>Recent User Registrations</h3>
                    <table className='dash-table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.userid}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Reports & Charts */}
                <div className="charts">
                    <div className="chart">
                        <h4>User Activity</h4>
                        <div className="pie-chart">
                        <PieChart
                            series={[
                                {
                                data: [
                                    { id: 0, value: 10, label: 'series A' },
                                    { id: 1, value: 15, label: 'series B' },
                                    { id: 2, value: 20, label: 'series C' },
                                ],
                                },
                            ]}
                        />
                        </div> {/* Placeholder for PieChart */}
                    </div>
                    <div className="chart">
                        <h4>Monthly Growth</h4>
                        <div className="line-chart">
                        <LineChart
                            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                            series={[
                                {
                                data: [2, 5.5, 2, 8.5, 1.5, 5],
                                },
                            ]}
                            />
                        </div> {/* Placeholder for LineChart */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dash;

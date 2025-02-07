import React from "react";
import { Link } from 'react-router-dom';
import "./Sidebar.css";
function SideBar() {
    return(
        <div className="sidebar">
            <h2>Admin Menu</h2>
            <ul>
                <li><Link to="/coursemanage">Courses</Link></li>
                <li><Link to="/learning">Domains</Link></li>
                <li><Link to="/usermanage">Users</Link></li>
                <li><Link to="/reports">Reports</Link></li>
            </ul>
        </div>
    );
}
export default SideBar;
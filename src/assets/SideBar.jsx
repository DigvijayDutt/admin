import React from "react";
import { Link } from 'react-router-dom';
import "./SideBar.css";
import * as i from "@phosphor-icons/react";
function SideBar() {
    return(
        <div className="sidebar">
            <h2><Link to="/dash"><i.House size={32}/></Link></h2>
            <ul>
                <li><Link to="/coursemanage">Courses</Link></li>
                <li><Link to="/learning">Domains</Link></li>
                <li><Link to="/usermanage">Users</Link></li>
                <li><Link to="/batchmanage">Batches</Link></li>
                <li><Link to="">Reports</Link></li>
            </ul>
        </div>
    );
}
export default SideBar;
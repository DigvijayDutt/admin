import React from "react";
import { Link } from 'react-router-dom';
import "./Sidebar.css";
function SideBar() {
    return(
        <div className="sidebar">
            <h2><Link to= "/dash"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M208,136H176V104h16a16,16,0,0,0,16-16V40a16,16,0,0,0-16-16H64A16,16,0,0,0,48,40V88a16,16,0,0,0,16,16H80v32H48a16,16,0,0,0-16,16v16a16,16,0,0,0,16,16h8v40a8,8,0,0,0,16,0V184H184v40a8,8,0,0,0,16,0V184h8a16,16,0,0,0,16-16V152A16,16,0,0,0,208,136ZM64,40H192V88H64Zm32,64h64v32H96Zm112,64H48V152H208v16Z"></path></svg>Admin Menu</Link></h2>
            <ul>
                <li><Link to="/coursemanage">Courses</Link></li>
                <li><Link to="/learning">Domains</Link></li>
                <li><Link to="/usermanage">Users</Link></li>
                <li><Link to="">Reports</Link></li>
            </ul>
        </div>
    );
}
export default SideBar;
import React from "react";
import { Link } from 'react-router-dom';
import "./Sidebar.css";
import * as i from "@phosphor-icons/react";
function SideBar() {
    return(
        <div className="sidebar">
            <h2><Link to="/dash"><i.House size={32}/></Link></h2>
            <ul>
                <li><Link to="/coursemanage"><i.Notebook size={22} />Courses</Link></li>
                <li><Link to="/learning"><i.HeadCircuit size={22} />Domains</Link></li>
                <li><Link to="/studentreg"><i.Users size={22}/>Student Registration</Link></li>
                <li><Link to=""><i.Article size={22} />Reports</Link></li>
            </ul>
        </div>
    );
}
export default SideBar;  
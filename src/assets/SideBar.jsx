import React from "react";
import { Link, useLocation } from 'react-router-dom';
import * as i from "@phosphor-icons/react";
import "./SideBar.css";

function SideBar() {
  const location = useLocation();

  return(
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/dash" className="brand-link">
          <i.House size={28} weight="fill" />
          <span>AdminHub</span>
        </Link>
      </div>
      
      <nav>
        <ul>
          <li>
            <Link 
              to="/coursemanage" 
              className={location.pathname === '/coursemanage' ? 'active' : ''}
            >
              <i.Notebook size={24} />
              <span>Courses</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/learning" 
              className={location.pathname === '/learning' ? 'active' : ''}
            >
              <i.HeadCircuit size={24} />
              <span>Domains</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/studentreg" 
              className={location.pathname === '/studentreg' ? 'active' : ''}
            >
              <i.Users size={24} />
              <span>Students</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/batchmanage" 
              className={location.pathname === '/Batches' ? 'active' : ''}
            >
              <i.Article size={24} />
              <span>Batches</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SideBar;
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <Nav className="sidebar-nav flex-column">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-speedometer2"></i> Dashboard
        </NavLink>
        
        <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-people"></i> Employees
        </NavLink>
      </Nav>
    </div>
  );
};

export default Sidebar;
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="jumbotron">
      <h1 className="display-4">Welcome to Worklog Management System</h1>
      <p className="lead">
        This system allows employees to log their monthly work efforts across different activities.
      </p>
      <hr className="my-4" />
      <p>
        Use the navigation menu to access different features of the system.
      </p>
      <div className="d-flex gap-3">
        <Link to="/employees" className="btn btn-primary">View Employees</Link>
        <Link to="/worklogs/new" className="btn btn-success">Add Worklog</Link>
        <Link to="/dashboard" className="btn btn-info">View Dashboard</Link>
      </div>
    </div>
  );
};

export default Home;
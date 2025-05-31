import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeDetail from './pages/EmployeeDetail';
import EmployeeForm from './pages/EmployeeForm';
import WorklogForm from './pages/WorklogForm';
import WorklogTypeList from './pages/WorklogTypeList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content-container">
          <Sidebar />
          <main className="main-content">
            <Container fluid className="py-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/employees/:id" element={<EmployeeDetail />} />
                <Route path="/employees/new" element={<EmployeeForm />} />
                <Route path="/employees/edit/:id" element={<EmployeeForm />} />
                <Route path="/worklogs/new" element={<WorklogForm />} />
                <Route path="/worklogs/edit/:id" element={<WorklogForm />} />
                <Route path="/worklog-types" element={<WorklogTypeList />} />
              </Routes>
            </Container>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
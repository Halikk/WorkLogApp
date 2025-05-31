import React, { useState, useEffect } from 'react';
import {
  getEmployees,
  getEmployeeEffortSummary,
  getTeamLeadEffortSummary,
  getDirectorEffortSummary,
  getTotalEffortByEmployee,
  getTotalEffortByTeamLead,
  getTotalEffortByDirector
} from '../services/api';
import { Employee } from '../types';

const Dashboard: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedTeamLead, setSelectedTeamLead] = useState<string>('');
  const [selectedDirector, setSelectedDirector] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().substring(0, 7)); // YYYY-MM format

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teamLeads, setTeamLeads] = useState<string[]>([]);
  const [directors, setDirectors] = useState<string[]>([]);

  const [employeeEffortSummary, setEmployeeEffortSummary] = useState<any>(null);
  const [teamLeadEffortSummary, setTeamLeadEffortSummary] = useState<any>(null);
  const [directorEffortSummary, setDirectorEffortSummary] = useState<any>(null);

  const [totalEffortByEmployee, setTotalEffortByEmployee] = useState<number | null>(null);
  const [totalEffortByTeamLead, setTotalEffortByTeamLead] = useState<number | null>(null);
  const [totalEffortByDirector, setTotalEffortByDirector] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees, team leads, and directors on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getEmployees();
        const employeesData = response.data;
        setEmployees(employeesData);

        // Extract unique team leads and directors
        const uniqueTeamLeads = Array.from(
            new Set(employeesData.map((emp: Employee) => emp.teamLead).filter(Boolean))
        );
        setTeamLeads(uniqueTeamLeads as string[]);

        const uniqueDirectors = Array.from(
            new Set(employeesData.map((emp: Employee) => emp.director).filter(Boolean))
        );
        setDirectors(uniqueDirectors as string[]);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch initial data');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch employee effort data when employee or month changes
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!selectedEmployee || !selectedMonth) return;

      try {
        const employeeId = parseInt(selectedEmployee);
        // Backend expects MM-yyyy format but we have YYYY-MM format
        const [year, month] = selectedMonth.split('-');
        const formattedMonth = `${month}-${year}`;

        const summaryResponse = await getEmployeeEffortSummary(employeeId, formattedMonth);
        setEmployeeEffortSummary(summaryResponse.data);

        const totalResponse = await getTotalEffortByEmployee(employeeId, formattedMonth);
        setTotalEffortByEmployee(totalResponse.data);
      } catch (err) {
        console.error('Failed to fetch employee effort data:', err);
      }
    };

    fetchEmployeeData();
  }, [selectedEmployee, selectedMonth]);

  // Fetch team lead effort data when team lead or month changes
  useEffect(() => {
    const fetchTeamLeadData = async () => {
      if (!selectedTeamLead || !selectedMonth) return;

      try {
        // Backend expects MM-yyyy format but we have YYYY-MM format
        const [year, month] = selectedMonth.split('-');
        const formattedMonth = `${month}-${year}`;

        const summaryResponse = await getTeamLeadEffortSummary(selectedTeamLead, formattedMonth);
        setTeamLeadEffortSummary(summaryResponse.data);

        const totalResponse = await getTotalEffortByTeamLead(selectedTeamLead, formattedMonth);
        setTotalEffortByTeamLead(totalResponse.data);
      } catch (err) {
        console.error('Failed to fetch team lead effort data:', err);
      }
    };

    fetchTeamLeadData();
  }, [selectedTeamLead, selectedMonth]);

  // Fetch director effort data when director or month changes
  useEffect(() => {
    const fetchDirectorData = async () => {
      if (!selectedDirector || !selectedMonth) return;

      try {
        // Backend expects MM-yyyy format but we have YYYY-MM format
        const [year, month] = selectedMonth.split('-');
        const formattedMonth = `${month}-${year}`;

        const summaryResponse = await getDirectorEffortSummary(selectedDirector, formattedMonth);
        setDirectorEffortSummary(summaryResponse.data);

        const totalResponse = await getTotalEffortByDirector(selectedDirector, formattedMonth);
        setTotalEffortByDirector(totalResponse.data);
      } catch (err) {
        console.error('Failed to fetch director effort data:', err);
      }
    };

    fetchDirectorData();
  }, [selectedDirector, selectedMonth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Helper function to render effort summary
  const renderEffortSummary = (summary: any) => {
    if (!summary) return <p>No data available</p>;

    console.log('Full summary data:', summary);
    
    // Convert the summary to an array of entries we can iterate over
    const entries = Object.entries(summary);
    console.log('Entries:', entries);
    
    return (
        <table className="table table-striped">
          <thead>
          <tr>
            <th>Worklog Type</th>
            <th>Total Hours</th>
          </tr>
          </thead>
          <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={2}>No data available</td>
            </tr>
          ) : (
            entries.map(([key, hours]: [any, any], index) => {
              console.log(`Entry ${index}:`, { key, hours });
              
              // Try to extract the worklog type name
              let typeName = 'Unknown';
              
              try {
                // If the key is a JSON string, parse it
                if (typeof key === 'string' && key.includes('{')) {
                  try {
                    const parsedKey = JSON.parse(key);
                    if (parsedKey && parsedKey.name) {
                      typeName = parsedKey.name;
                    }
                  } catch (e) {
                    // Not valid JSON
                  }
                }
                
                // If the key is an object with id and name properties
                if (typeof key === 'object' && key !== null) {
                  console.log('Key is object:', key);
                  if (key.name) {
                    typeName = key.name;
                  }
                }
                
                // If the key is a string that might be a Java object reference
                if (typeof key === 'string' && key.includes('@')) {
                  // This is likely a Java object reference
                  // Let's try to extract the worklog type ID and fetch its name
                  console.log('Java object reference:', key);
                }
              } catch (e) {
                console.error('Error parsing worklog type:', e);
              }
              
              return (
                <tr key={index}>
                  <td>{typeName}</td>
                  <td>{hours}</td>
                </tr>
              );
            })
          )}
          </tbody>
        </table>
    );
  };

  return (
      <div>
        <h2>Dashboard</h2>

        <div className="mb-4">
          <label htmlFor="monthSelector" className="form-label">Select Month</label>
          <input
              type="month"
              id="monthSelector"
              className="form-control"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        <div className="row">
          {/* Employee Section */}
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header">
                <h3>Employee Dashboard</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="employeeSelector" className="form-label">Select Employee</label>
                  <select
                      id="employeeSelector"
                      className="form-select"
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName}
                        </option>
                    ))}
                  </select>
                </div>

                {selectedEmployee && (
                    <>
                      <div className="alert alert-info mt-3">
                        <h4 className="alert-heading">Total Hours</h4>
                        <p className="display-4 text-center">{totalEffortByEmployee || 0}</p>
                      </div>
                    </>
                )}
              </div>
            </div>
          </div>

          {/* Team Lead Section */}
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header">
                <h3>Team Lead Dashboard</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="teamLeadSelector" className="form-label">Select Team Lead</label>
                  <select
                      id="teamLeadSelector"
                      className="form-select"
                      value={selectedTeamLead}
                      onChange={(e) => setSelectedTeamLead(e.target.value)}
                  >
                    <option value="">Select Team Lead</option>
                    {teamLeads.map((teamLead) => (
                        <option key={teamLead} value={teamLead}>
                          {teamLead}
                        </option>
                    ))}
                  </select>
                </div>

                {selectedTeamLead && (
                    <>
                      <div className="alert alert-info mt-3">
                        <h4 className="alert-heading">Total Hours</h4>
                        <p className="display-4 text-center">{totalEffortByTeamLead || 0}</p>
                      </div>
                    </>
                )}
              </div>
            </div>
          </div>

          {/* Director Section */}
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header">
                <h3>Director Dashboard</h3>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="directorSelector" className="form-label">Select Director</label>
                  <select
                      id="directorSelector"
                      className="form-select"
                      value={selectedDirector}
                      onChange={(e) => setSelectedDirector(e.target.value)}
                  >
                    <option value="">Select Director</option>
                    {directors.map((director) => (
                        <option key={director} value={director}>
                          {director}
                        </option>
                    ))}
                  </select>
                </div>

                {selectedDirector && (
                    <>
                      <div className="alert alert-info mt-3">
                        <h4 className="alert-heading">Total Hours</h4>
                        <p className="display-4 text-center">{totalEffortByDirector || 0}</p>
                      </div>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
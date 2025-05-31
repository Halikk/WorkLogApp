import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEmployeeById, getWorklogsByEmployee } from '../services/api';
import { Employee, Worklog } from '../types';

// Define the actual structure of the API response
interface WorklogResponse {
    id: number;
    employeeId: number;
    monthDate: string; // This is what the backend returns
    effort: number;   // This is what the backend returns (not hours)
    worklogTypeId: number;
    description?: string;
    worklogType?: {
        id: number;
        name: string;
    };
    employee?: {
        id: number;
        firstName: string;
        lastName: string;
    };
}

const EmployeeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [worklogs, setWorklogs] = useState<WorklogResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                if (!id) return;

                const employeeId = parseInt(id);
                const employeeResponse = await getEmployeeById(employeeId);
                setEmployee(employeeResponse.data);

                const worklogsResponse = await getWorklogsByEmployee(employeeId);
                setWorklogs(worklogsResponse.data);

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch employee data');
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!employee) {
        return <div className="alert alert-warning">Employee not found</div>;
    }

    return (
        <div>
            <h2>Employee Details</h2>
            <div className="card mb-4">
                <div className="card-header">
                    <h3>{employee.firstName} {employee.lastName}</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>ID:</strong> {employee.id}</p>
                            <p><strong>Grade:</strong> {typeof employee.grade === 'string' ? employee.grade : (employee.grade && typeof employee.grade === 'object' && employee.grade.name ? employee.grade.name : 'N/A')}</p>
                            <p><strong>Team Lead:</strong> {employee.teamLead || 'N/A'}</p>
                            <p><strong>Director:</strong> {employee.director || 'N/A'}</p>
                        </div>
                        <div className="col-md-6">
                            {/* Start Date and End Date are commented out as they don't appear in the Employee interface */}
                            {/* <p><strong>Start Date:</strong> {employee.startDate ? new Date(employee.startDate).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>End Date:</strong> {employee.endDate ? new Date(employee.endDate).toLocaleDateString() : 'N/A'}</p> */}
                        </div>
                    </div>
                </div>
            </div>

            <h3>Worklogs</h3>
            {worklogs.length === 0 ? (
                <div className="alert alert-info">No worklogs found for this employee</div>
            ) : (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Month</th>
                        <th>Type</th>
                        <th>Effort (hours)</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {worklogs.map((worklog) => (
                        <tr key={worklog.id}>
                            <td>{worklog.id}</td>
                            <td>{worklog.monthDate ? new Date(worklog.monthDate + '-01').toLocaleDateString('default', { year: 'numeric', month: 'long' }) : 'N/A'}</td>
                            <td>{worklog.worklogType?.name || 'Unknown'}</td>
                            <td>{worklog.effort}</td>
                            <td>
                                <Link to={`/worklogs/edit/${worklog.id}`} className="btn btn-warning btn-sm me-2">
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="mt-3">
                <Link to={`/worklogs/new?employeeId=${employee.id}`} className="btn btn-primary">
                    Add Worklog
                </Link>
                <Link to="/employees" className="btn btn-secondary ms-2">
                    Back to List
                </Link>
            </div>
        </div>
    );
};

export default EmployeeDetail;
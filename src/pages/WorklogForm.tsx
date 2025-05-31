import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    getWorklogById,
    createWorklog,
    updateWorklog,
    getEmployees,
    getWorklogTypes
} from '../services/api';
import { Employee, WorklogType } from '../types';

const WorklogForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const preselectedEmployeeId = queryParams.get('employeeId');

    const [formData, setFormData] = useState({
        employeeId: preselectedEmployeeId || '',
        worklogTypeId: '',
        monthDate: new Date().toISOString().substring(0, 7), // YYYY-MM format
        effort: ''
    });

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [worklogTypes, setWorklogTypes] = useState<WorklogType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch employees and worklog types
                const [employeesResponse, worklogTypesResponse] = await Promise.all([
                    getEmployees(),
                    getWorklogTypes()
                ]);

                setEmployees(employeesResponse.data);
                setWorklogTypes(worklogTypesResponse.data);

                // If editing an existing worklog, fetch its data
                if (id) {
                    const worklogId = parseInt(id);
                    const worklogResponse = await getWorklogById(worklogId);
                    const worklog = worklogResponse.data;

                    setFormData({
                        employeeId: worklog.employee.id.toString(),
                        worklogTypeId: worklog.worklogType.id.toString(),
                        monthDate: worklog.monthDate.substring(0, 7),
                        effort: worklog.effort.toString()
                    });
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to load form data');
                setLoading(false);
            }
        };

        fetchData();
    }, [id, preselectedEmployeeId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // The backend expects monthDate in a format that can be parsed to YearMonth
            // We need to ensure we're sending just the year and month without the day
            const worklogData = {
                employee: { id: parseInt(formData.employeeId) },
                worklogType: { id: parseInt(formData.worklogTypeId) },
                monthDate: formData.monthDate, // Just send YYYY-MM format
                effort: parseFloat(formData.effort)
            };

            if (id) {
                // Update existing worklog
                await updateWorklog(parseInt(id), worklogData);
            } else {
                // Create new worklog
                await createWorklog(worklogData);
            }

            navigate('/employees/' + formData.employeeId);
        } catch (err) {
            console.error('Error saving worklog:', err);
            setError('Failed to save worklog');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{id ? 'Edit Worklog' : 'Add New Worklog'}</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="employeeId" className="form-label">Employee</label>
                    <select
                        id="employeeId"
                        name="employeeId"
                        className="form-select"
                        value={formData.employeeId}
                        onChange={handleChange}
                        required
                        disabled={!!preselectedEmployeeId}
                    >
                        <option value="">Select Employee</option>
                        {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                                {employee.firstName} {employee.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="worklogTypeId" className="form-label">Worklog Type</label>
                    <select
                        id="worklogTypeId"
                        name="worklogTypeId"
                        className="form-select"
                        value={formData.worklogTypeId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Type</option>
                        {worklogTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="monthDate" className="form-label">Month</label>
                    <input
                        type="month"
                        id="monthDate"
                        name="monthDate"
                        className="form-control"
                        value={formData.monthDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="effort" className="form-label">Effort (hours)</label>
                    <input
                        type="number"
                        id="effort"
                        name="effort"
                        className="form-control"
                        value={formData.effort}
                        onChange={handleChange}
                        min="0"
                        step="0.5"
                        required
                    />
                </div>

                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WorklogForm;
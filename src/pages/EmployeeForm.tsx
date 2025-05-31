import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { getEmployeeById, createEmployee, updateEmployee, getGrades } from '../services/api';
import { Employee, Grade } from '../types';

const EmployeeForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    interface FormData extends Omit<Partial<Employee>, 'grade'> {
        grade?: Grade;
    }

    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        teamLead: '',
        director: '',
        startDate: '',
        endDate: '',
        grade: undefined
    });

    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch grades
                const gradesResponse = await getGrades();
                setGrades(gradesResponse.data);

                // If edit mode, fetch employee data
                if (isEditMode && id) {
                    const employeeResponse = await getEmployeeById(parseInt(id));
                    const employee = employeeResponse.data;

                    // Format dates for form inputs
                    const formattedEmployee = {
                        ...employee,
                        startDate: employee.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : '',
                        endDate: employee.endDate ? new Date(employee.endDate).toISOString().split('T')[0] : null
                    };

                    setFormData(formattedEmployee);
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to load form data');
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'gradeId') {
            const gradeId = parseInt(value);
            setFormData(prev => ({
                ...prev,
                grade: isNaN(gradeId) ? undefined : grades.find(g => g.id === gradeId)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? null : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        // Check if grade is selected
        if (!formData.grade && !isEditMode) {
            setError('Please select a grade');
            setSubmitting(false);
            return;
        }

        try {
            if (isEditMode && id) {
                await updateEmployee(parseInt(id), formData);
                setSuccess('Employee updated successfully');
            } else {
                await createEmployee(formData);
                setSuccess('Employee created successfully');
                setFormData({
                    firstName: '',
                    lastName: '',
                    teamLead: '',
                    director: '',
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: undefined,
                    grade: { id: 0, name: '' }
                });
            }

            // Redirect after a short delay to show success message
            setTimeout(() => {
                navigate('/employees');
            }, 1500);
        } catch (err) {
            setError('Failed to save employee');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading form...</p>
            </div>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
                <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/employees')}
                >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Employees
                </Button>
            </div>

            {error && (
                <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success" className="mb-4">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {success}
                </Alert>
            )}

            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Team Lead</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="teamLead"
                                        value={formData.teamLead || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Director</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="director"
                                        value={formData.director || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Grade</Form.Label>
                                    <Form.Select
                                        name="grade"
                                        value={formData.grade?.id?.toString() || ''}
                                        onChange={(e) => {
                                            const gradeId = parseInt(e.target.value);
                                            const selectedGrade = grades.find(g => g.id === gradeId);
                                            if (selectedGrade) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    grade: selectedGrade
                                                }));
                                            }
                                        }}
                                        required
                                    >
                                        <option value="">Select Grade</option>
                                        {grades.map(grade => (
                                            <option key={grade.id} value={grade.id}>
                                                {grade.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date (Leave blank if still employed)</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                            <Button
                                variant="secondary"
                                className="me-2"
                                onClick={() => navigate('/employees')}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Saving...
                                    </>
                                ) : (
                                    isEditMode ? 'Update Employee' : 'Create Employee'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
};

export default EmployeeForm;
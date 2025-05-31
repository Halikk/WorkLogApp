import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { getWorklogTypes, createWorklogType, updateWorklogType, deleteWorklogType } from '../services/api';
import { WorklogType } from '../types';

const WorklogTypeList: React.FC = () => {
  const [worklogTypes, setWorklogTypes] = useState<WorklogType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentWorklogType, setCurrentWorklogType] = useState<Partial<WorklogType>>({ name: '' });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchWorklogTypes();
  }, []);

  const fetchWorklogTypes = async () => {
    try {
      setLoading(true);
      const response = await getWorklogTypes();
      setWorklogTypes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch worklog types');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (worklogType?: WorklogType) => {
    if (worklogType) {
      setCurrentWorklogType(worklogType);
      setIsEditing(true);
    } else {
      setCurrentWorklogType({ name: '' });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentWorklogType({ name: '' });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentWorklogType(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (isEditing && currentWorklogType.id) {
        await updateWorklogType(currentWorklogType.id, currentWorklogType);
      } else {
        await createWorklogType(currentWorklogType);
      }
      fetchWorklogTypes();
      handleCloseModal();
    } catch (err) {
      setError('Failed to submit worklog type');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Add confirmation before deleting
    if (!window.confirm('Are you sure you want to delete this worklog type?')) {
      return;
    }
    
    try {
      await deleteWorklogType(id);
      fetchWorklogTypes();
    } catch (err) {
      setError('Failed to delete worklog type');
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Worklog Types</h3>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          Add Worklog Type
        </Button>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {worklogTypes.map(worklogType => (
                <tr key={worklogType.id}>
                  <td>{worklogType.id}</td>
                  <td>{worklogType.name}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleOpenModal(worklogType)} className="me-2">
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(worklogType.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Worklog Type' : 'Add Worklog Type'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formWorklogTypeName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentWorklogType.name || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default WorklogTypeList;
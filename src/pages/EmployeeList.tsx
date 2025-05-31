import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge } from 'react-bootstrap';
import { getEmployees, deleteEmployee } from '../services/api';
import { Employee } from '../types';
// @ts-ignore
import { FaUserPlus, FaSearch, FaEye, FaEdit, FaTrash, FaPlus, FaUsers, FaUserCheck, FaUserTimes } from 'react-icons/fa';

// @ts-ignore
const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployees();
        setEmployees(response.data);
        setFilteredEmployees(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const searchLower = searchTerm.toLowerCase().trim();
      const filtered = employees.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(searchLower) ||
          employee.lastName.toLowerCase().includes(searchLower) ||
          `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchLower)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    
    setIsDeleting(true);
    setError(null);
    try {
      // Delete the employee
      await deleteEmployee(employeeToDelete.id);
      
      // Remove the employee from the list
      const updatedEmployees = employees.filter(emp => emp.id !== employeeToDelete.id);
      
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
      setShowDeleteModal(false);
      
      // Show success message
      setError('Çalışan başarıyla silindi.');
      setTimeout(() => setError(null), 3000); // Clear the message after 3 seconds
    } catch (err: any) {
      console.error('Error deleting employee:', err);
      setError('Çalışan silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsDeleting(false);
      setEmployeeToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading employees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  // Calculate statistics
  const activeEmployees = employees.filter(emp => !emp.endDate).length;
  const inactiveEmployees = employees.length - activeEmployees;

  return (
    <div className="container fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-1">Çalışan Yönetimi</h2>
          <p className="text-muted mb-0">Toplam {employees.length} çalışan listeleniyor</p>
        </div>
        <Link to="/employees/new" className="btn btn-primary px-4">
          <FaUserPlus className="me-2" />
          Yeni Çalışan Ekle
        </Link>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-soft-primary rounded-circle p-3 me-3">
                <FaUsers size={24} className="text-primary" />
              </div>
              <div>
                <h6 className="text-uppercase text-muted mb-1">Toplam Çalışan</h6>
                <h3 className="mb-0">{employees.length}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-soft-success rounded-circle p-3 me-3">
                <FaUserCheck size={24} className="text-success" />
              </div>
              <div>
                <h6 className="text-uppercase text-muted mb-1">Aktif Çalışan</h6>
                <h3 className="mb-0">{activeEmployees}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-soft-danger rounded-circle p-3 me-3">
                <FaUserTimes size={24} className="text-danger" />
              </div>
              <div>
                <h6 className="text-uppercase text-muted mb-1">Pasif Çalışan</h6>
                <h3 className="mb-0">{inactiveEmployees}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-0">
          <div className="p-3 border-bottom">
            <Row className="align-items-center">
              <Col md={6}>
                <InputGroup className="search-box">
                  <InputGroup.Text className="bg-white border-end-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Çalışan ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                  {searchTerm && (
                    <Button 
                      variant="link" 
                      className="text-muted"
                      onClick={() => setSearchTerm('')}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  )}
                </InputGroup>
              </Col>
              <Col md={6} className="text-md-end mt-2 mt-md-0">
                <span className="text-muted small">
                  {filteredEmployees.length} sonuç bulundu
                </span>
              </Col>
            </Row>
          </div>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>ÇALIŞAN</th>
                  <th>KADRO</th>
                  <th>YÖNETİCİ</th>
                  <th>İŞE BAŞLAMA</th>
                  <th>DURUM</th>
                  <th className="text-end">İŞLEMLER</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <div className="py-4">
                        <i className="bi bi-people text-muted" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
                        <h5 className="mt-3">Kayıt bulunamadı</h5>
                        <p className="text-muted">Arama kriterlerinize uygun çalışan bulunamadı</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="align-middle">
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-soft-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                            <span className="text-primary fw-bold">
                              {employee.firstName[0]}{employee.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <Link to={`/employees/${employee.id}`} className="text-dark fw-semibold text-decoration-hover">
                              {employee.firstName} {employee.lastName}
                            </Link>
                            <div className="text-muted small">
                              {employee.teamLead || 'Yönetici yok'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="light" className="text-dark border">
                          {typeof employee.grade === 'string' ? employee.grade : employee.grade?.name || 'Belirtilmemiş'}
                        </Badge>
                      </td>
                      <td>
                        <div className="text-muted">{employee.teamLead || '-'}</div>
                      </td>
                      <td>
                        <div className="text-muted">
                          {employee.startDate ? new Date(employee.startDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                        </div>
                      </td>
                      <td>
                        {employee.endDate ? (
                          <Badge bg="light" className="text-danger border">
                            <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                            Pasif
                          </Badge>
                        ) : (
                          <Badge bg="success" className="bg-opacity-10 text-success">
                            <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                            Aktif
                          </Badge>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end">
                          <Link
                            to={`/employees/${employee.id}`}
                            className="btn btn-icon btn-sm btn-soft-primary rounded-circle me-2"
                            title="Detayları Görüntüle"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/employees/edit/${employee.id}`}
                            className="btn btn-icon btn-sm btn-soft-warning rounded-circle me-2"
                            title="Düzenle"
                          >
                            <FaEdit />
                          </Link>
                          <Link
                            to={`/worklogs/new?employeeId=${employee.id}`}
                            className="btn btn-icon btn-sm btn-soft-success rounded-circle me-2"
                            title="İş Kaydı Ekle"
                          >
                            <FaPlus />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteClick(employee);
                            }}
                            className="btn btn-icon btn-sm btn-soft-danger rounded-circle"
                            disabled={isDeleting}
                            title="Sil"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      {employeeToDelete && (
        <Modal 
          show={showDeleteModal} 
          onHide={() => !isDeleting && setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="h5">Çalışanı Sil</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            <div className="text-center mb-4">
              <div className="avatar-lg mx-auto mb-3">
                <div className="avatar-title bg-soft-danger text-danger rounded-circle">
                  <FaTrash size={24} />
                </div>
              </div>
              <h5 className="mb-2">Silmek istediğinize emin misiniz?</h5>
              <p className="text-muted mb-0">
                <strong>{employeeToDelete.firstName} {employeeToDelete.lastName}</strong> isimli çalışanı ve tüm iş kayıtlarını tamamen silmek üzeresiniz.
                Bu işlem geri alınamaz.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <div className="d-flex justify-content-end gap-2 w-100">
              <Button 
                variant="light" 
                onClick={() => setShowDeleteModal(false)} 
                disabled={isDeleting}
                className="px-4"
              >
                İptal
              </Button>
              <Button 
                variant="danger" 
                onClick={handleConfirmDelete} 
                disabled={isDeleting}
                className="px-4"
              >
                {isDeleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Siliniyor...
                  </>
                ) : 'Sil'}
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </div>
);
};

export default EmployeeList;